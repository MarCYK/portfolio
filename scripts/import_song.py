#!/usr/bin/env python3
"""Import a MIDI file into src/lib/song-data-notes.ts.

The homepage sequencer plays a fixed note list stored as IMPORTED_NOTES in
src/lib/song-data-notes.ts, formatted as:

    export const IMPORTED_NOTES: [number, number, number, number][] = [
      [timeUnit, midiPitch, duration, velocity],
      ...
    ];

  timeUnit   = start position in 16th-note steps (song runs at 80 BPM, so one
               step = 60000/80/4 = 187.5 ms; see MS_PER_UNIT in song-data.ts)
  midiPitch  = 0..127 MIDI note number
  duration   = length in 16th-note steps (min 1)
  velocity   = 0..1 loudness multiplier (raw; shaped at runtime by shapeVolume)

This script reads a .mid file, extracts every note_on -> matching note_off as
one note, snaps start and length to the 16th-note grid, and rewrites
song-data-notes.ts with the result. It preserves the existing file header and
keeps notes sorted by start time so convertSongNote's ms math stays monotonic.

Usage:
    python scripts/import_song.py path/to/song.mid
    python scripts/import_song.py song.mid --list-tracks        # see track indexes
    python scripts/import_song.py song.mid --tracks 13,25       # keep only those tracks
    python scripts/import_song.py song.mid --name "My Song" --out custom.ts
    python scripts/import_song.py song.mid --min-vel 10  # drop ghost notes
"""
from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path

try:
    import mido
except ImportError:
    sys.exit(
        "mido not found. Install with:  pip install -r scripts/requirements.txt"
    )

# Song runs at 80 BPM. One step = one 16th note. Tempo does not change the
# step *count* per note (16ths are 16ths regardless of BPM), so we quantize
# MIDI ticks directly to 16th steps without any tempo math.
DEFAULT_OUT = Path("src/lib/song-data-notes.ts")
HEADER_LINES = [
    '// {name}',
    '// Auto-generated from {source} by scripts/import_song.py.',
    '// Format: [timeUnit, midiPitch, duration, velocity]',
    '//   timeUnit = 16th-note steps at 80 BPM (MS_PER_UNIT = 60000 / 80 / 4 = 187.5ms)',
    '//   midiPitch = 0..127 MIDI note number',
    '//   duration = in 16th-note units (min 1)',
    '//   velocity = 0..1 multiplier (raw input; shaped at runtime)',
]


@dataclass
class Note:
    start_step: float
    midi: int
    dur_step: int
    vel: float


def ticks_per_16th(ticks_per_beat: int) -> float:
    # 4 sixteenths per beat.
    return ticks_per_beat / 4


def extract_notes(
    midi_path: Path,
    min_vel: int,
    skip_channel_9: bool,
    track_filter: set[int] | None,
    normalize_vel: bool,
) -> list[Note]:
    # clip=True clamps out-of-range data bytes to 127 instead of aborting.
    # Some DAW/synth exports contain bytes > 127 (spec-violating but common);
    # 127 is the max valid value anyway, so clamping is lossless for playback.
    mid = mido.MidiFile(midi_path, clip=True)
    step = ticks_per_16th(mid.ticks_per_beat)
    if step <= 0:
        sys.exit(f"Invalid ticks_per_beat: {mid.ticks_per_beat}")

    # Iterate tracks individually (not merge_tracks) so we can both filter by
    # track index and keep each track's delta-time arithmetic independent.
    notes: list[Note] = []
    for track_idx, track in enumerate(mid.tracks):
        if track_filter is not None and track_idx not in track_filter:
            continue

        abs_tick = 0  # mido msg.time is a delta; accumulate to absolute.
        # FIFO queue of open start-ticks per note. A note_on pushes a start;
        # a note_off pops the OLDEST. This lets the same pitch ring twice at
        # once (e.g. doubled events in OnlineSequencer exports) instead of
        # collapsing or re-striking them.
        open_starts: dict[int, list[int]] = {}
        for msg in track:
            abs_tick += msg.time
            if msg.type not in ("note_on", "note_off"):
                continue
            if skip_channel_9 and msg.channel == 9:
                continue

            is_off = msg.type == "note_off" or msg.velocity == 0
            if not is_off and msg.velocity >= min_vel:
                open_starts.setdefault(msg.note, []).append(abs_tick)
            elif is_off and open_starts.get(msg.note):
                start = open_starts[msg.note].pop(0)
                notes.append(_build(start, abs_tick, msg.note, msg.velocity, step))

        # Notes never closed get a 1-step length so nothing is silently dropped.
        for note, starts in open_starts.items():
            for start in starts:
                notes.append(_build(start, abs_tick, note, 1, step))

    if normalize_vel:
        _normalize_velocities(notes)
    return notes


def _normalize_velocities(notes: list[Note]) -> None:
    # Scale the loudest note up to 1.0 and the rest proportionally. Matches
    # how the reference "Where Is My Mind" data collapses a constant-velocity
    # OnlineSequencer export (all notes at vel 50) to uniform 1.0.
    peak = max((n.vel for n in notes), default=0.0)
    if peak <= 0:
        return
    for n in notes:
        n.vel = round(n.vel / peak, 3)


def _build(start_tick: int, end_tick: int, midi: int, vel: int, step: float) -> Note:
    # Start is rounded to 2 dp so sub-16th grace notes keep their position
    # (e.g. 272.45) instead of snapping to a whole step. Duration is a whole
    # number of 16th units with a floor of 1.
    start_step = round(start_tick / step, 2)
    dur_step = max(1, round((end_tick - start_tick) / step))
    velocity = round(min(127, max(1, vel)) / 127, 3)
    return Note(start_step, midi, dur_step, velocity)


def _num(x: float) -> str:
    # Render whole numbers without a trailing .0 (272, not 272.0) but keep
    # genuine decimals (272.45). Matches how the reference data file is written.
    return f"{x:g}"


def render_ts(notes: list[Note], name: str, source: str) -> str:
    notes_sorted = sorted(notes, key=lambda n: (n.start_step, n.midi))

    header = "\n".join(
        line.format(name=name, source=source) for line in HEADER_LINES
    )
    # 6 tuples per line matches the existing file's density.
    rows = []
    for i in range(0, len(notes_sorted), 6):
        chunk = notes_sorted[i : i + 6]
        cells = ", ".join(
            f"[{_num(n.start_step)}, {n.midi}, {n.dur_step}, {_num(n.vel)}]"
            for n in chunk
        )
        sep = "," if i + 6 < len(notes_sorted) else ""
        rows.append(f"  {cells}{sep}")

    body = "\n".join(rows)
    return (
        f"{header}\n"
        f"export const IMPORTED_NOTES: [number, number, number, number][] = [\n"
        f"{body}\n"
        f"];\n"
    )


def _parse_track_filter(raw: str | None) -> set[int] | None:
    if raw is None or raw.strip() == "":
        return None
    try:
        idxs = {int(part.strip()) for part in raw.split(",") if part.strip()}
    except ValueError:
        sys.exit(f"--tracks must be comma-separated integers, got: {raw!r}")
    if any(i < 0 for i in idxs):
        sys.exit(f"--tracks indexes must be non-negative, got: {raw!r}")
    return idxs


def _list_tracks(midi_path: Path) -> int:
    mid = mido.MidiFile(midi_path, clip=True)
    print(f"{midi_path.name}  ({len(mid.tracks)} tracks, {mid.ticks_per_beat} ticks/beat)")
    print(f"{'idx':>3}  {'chan':>4}  {'notes':>6}  name")
    print("-" * 60)
    for idx, track in enumerate(mid.tracks):
        name = ""
        channel = "-"
        note_count = 0
        for msg in track:
            if msg.type == "track_name" and msg.name and not name:
                name = msg.name
            if msg.type == "note_on" and msg.velocity > 0:
                if channel == "-":
                    channel = msg.channel
                note_count += 1
        marker = "  (drums)" if channel == 9 else ""
        print(f"{idx:>3}  {str(channel):>4}  {note_count:>6}  {name}{marker}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Import a MIDI file into song-data-notes.ts."
    )
    parser.add_argument("midi", type=Path, help="Path to the .mid file.")
    parser.add_argument(
        "--out",
        type=Path,
        default=DEFAULT_OUT,
        help=f"Output .ts path (default: {DEFAULT_OUT}).",
    )
    parser.add_argument(
        "--name",
        default=None,
        help='Display name for the header comment (default: the MIDI filename).',
    )
    parser.add_argument(
        "--min-vel",
        type=int,
        default=1,
        help="Drop note_on events below this MIDI velocity (1..127). Default 1.",
    )
    parser.add_argument(
        "--keep-drums",
        action="store_true",
        help="Keep channel 9 (General MIDI percussion). Off by default.",
    )
    parser.add_argument(
        "--tracks",
        default=None,
        help="Comma-separated track indexes to keep (e.g. '13,25'). "
        "Default: all tracks. Run --list-tracks to see indexes.",
    )
    parser.add_argument(
        "--list-tracks",
        action="store_true",
        help="Print every track's index, channel, note count, and name, then exit.",
    )
    parser.add_argument(
        "--normalize-vel",
        action="store_true",
        help="Scale velocities so the loudest note is 1.0 (rest proportional). "
        "Matches how the reference Where Is My Mind data treats a constant-"
        "velocity OnlineSequencer export as uniform 1.0. Off by default.",
    )
    args = parser.parse_args(argv)

    if not args.midi.is_file():
        sys.exit(f"MIDI file not found: {args.midi}")

    if args.list_tracks:
        return _list_tracks(args.midi)

    track_filter = _parse_track_filter(args.tracks)

    name = args.name or args.midi.stem
    notes = extract_notes(
        args.midi,
        min_vel=max(1, args.min_vel),
        skip_channel_9=not args.keep_drums,
        track_filter=track_filter,
        normalize_vel=args.normalize_vel,
    )
    if not notes:
        sys.exit(f"No notes found in {args.midi}.")

    ts = render_ts(notes, name=name, source=args.midi.name)
    args.out.write_text(ts, encoding="utf-8")

    midis = [n.midi for n in notes]
    print(f"Wrote {len(notes)} notes to {args.out}")
    print(f"  pitch range: {min(midis)}..{max(midis)}")
    print(
        f"  length: {max(n.start_step + n.dur_step for n in notes)} steps "
        f"({max(n.start_step for n in notes) * 187.5 / 1000:.1f}s at 80 BPM)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
