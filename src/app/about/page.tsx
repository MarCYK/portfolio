import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import { GithubIcon, LinkedinIcon, IconEmail } from '@/components/MarCYKIcons';
import { EMAIL } from '@/data/constants';

export const metadata: Metadata = {
  title: 'marcyk - About',
};

export default function AboutPage() {
  return (
    <PageShell>
      <div className="px-6 sm:px-8 mx-auto flex-1 flex flex-col w-full" style={{ maxWidth: '1280px' }}>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
          <div className="lg:w-1/4 lg:pr-12 xl:pr-24 shrink-0 pt-12 lg:pt-20">
            <h1 className="page-heading mb-3">
              About
            </h1>
            <p className="about-prose" style={{ marginBottom: '32px' }}>
              Existentially ambiguous.
            </p>

            <div className="space-y-6">
              <details className="about-details" open>
                <summary className="tree-label">Contact</summary>
                <ul className="tree-children">
                  <li>
                    <a href={`mailto:${EMAIL}`} className="about-link transition-colors duration-200 hover:text-[var(--text-primary)]">
                      <IconEmail style={{ width: 14, height: 14, flexShrink: 0 }} />
                      {EMAIL}
                    </a>
                  </li>
                </ul>
              </details>
              <details className="about-details" open style={{ marginTop: '24px' }}>
                <summary className="tree-label">Links</summary>
                <ul className="tree-children">
                  <li>
                    <a
                      href="https://github.com/marcyk"
                      className="about-link transition-colors duration-200 hover:text-[var(--text-primary)]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon style={{ width: 14, height: 14, flexShrink: 0 }} />
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/marcyk1413/"
                      className="about-link transition-colors duration-200 hover:text-[var(--text-primary)]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedinIcon style={{ width: 14, height: 14, flexShrink: 0 }} />
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </details>
            </div>
          </div>

          <div className="hidden lg:block w-px shrink-0" style={{ borderLeft: '1px solid var(--border)' }} />

          <div className="lg:pl-12 xl:pl-24 flex-1 pt-2 lg:pt-20 pb-[112px]">
            <div className="lg:max-w-xl">
              <h1 className="page-heading !mb-[-32px]">
                MarCYK
              </h1>

              <section className="about-prose" style={{ marginTop: '48px' }}>
                <p>
                  I am a Full Stack AI Engineer covering backend, frontend, CI/CD, infrastructure, context engineering, agentic systems, autonomous systems, and automation.
                </p>
                <p style={{ marginTop: '12px' }}>
                  I specialize in building production-grade AI systems, multi-agent RAG pipelines, and developer platforms that directly improve operational efficiency and strategic decision-making.
                </p>
              </section>

              <section className="about-prose" style={{ marginTop: '48px' }}>
                <h2 className="about-h2">
                  THE PIANO
                </h2>
                <p>
                  The piano song on the homepage is a cover of Maxence Cyrin&apos;s solo piano rendition of the
                  Pixies&apos; &ldquo;Where Is My Mind,&rdquo; sourced from an OnlineSequencer.net arrangement whose
                  protobuf-encoded note data was decoded with a custom Python script to extract all 527 note
                  events. The sequencer runs at 80 BPM inside the <code>requestAnimationFrame</code> loop so audio
                  and visuals fire in the same tick with zero drift. Each note plays through the MusyngKite acoustic
                  grand piano soundfont loaded via soundfont-player, with volume shaping that boosts melody, cuts
                  bass, and softens high notes.
                </p>
                <p style={{ marginTop: '12px' }}>
                  Every playing note maps its MIDI pitch to a row on the Joy Division waveform and injects energy
                  that decays over time, bleeding into neighboring rows so chords spread across the canvas.
                  Simultaneous notes that collide on the same row get nudged apart so every note stays visible as
                  the song ripples through. Low notes render warm, high notes cool.
                </p>
              </section>

              <section className="about-prose" style={{ marginTop: '48px' }}>
                <h2 className="about-h2">
                  THE WAVEFORM
                </h2>
                <p>
                  The background canvas draws a stacked-line waveform modeled after the Unknown Pleasures album
                  cover by Joy Division, itself a plot of radio pulses from the pulsar CP 1919. Each row is filled
                  beneath its curve to occlude the row behind it, producing the same layered depth as the original.
                  The waveform is continuously animated with layered sine functions that shift over time.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
