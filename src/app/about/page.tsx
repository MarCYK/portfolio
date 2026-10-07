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
              Real stupidity beats artificial intelligence every time.
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
                  I&apos;m an AI solutions developer at Mettler Toledo, working across AIOps, UI/UX, and automation — full stack TypeScript and Python, proficient with AWS and Azure, with Terraform and CI/CD pipelines.
                </p>
                <p style={{ marginTop: '12px' }}>
                  Always curious, always learning, trying to make sense of it all. Taking things apart, finding the pattern, and putting it back together better.
                </p>
              </section>

              <section className="about-prose" style={{ marginTop: '48px' }}>
                <h2 className="about-h2">
                  NOW
                </h2>
                <p>
                  Shipping AI solutions at Mettler Toledo. Catching every major AI release. Experimenting with AI and automation, and how it can be applied to real-world problems.
                </p>
              </section>

              <section className="about-prose" style={{ marginTop: '48px' }}>
                <h2 className="about-h2">
                  THE PIANO
                </h2>
                <p>
                  The homepage is a three-song jukebox: Let It Happen (Tame Impala), On Melancholy Hill (Gorillaz — big fan), and the third movement of Moonlight Sonata (Beethoven). Each song is a MIDI arrangement from OnlineSequencer, decoded into note data by a custom Python script — 1,129, 1,149, and 6,420 notes respectively. The sequencer runs inside the <code>requestAnimationFrame</code> loop so audio and visuals fire on the same tick with zero drift, and every note plays through a MusyngKite acoustic grand soundfont with volume shaping that boosts melody and cuts bass.
                </p>
                <p style={{ marginTop: '12px' }}>
                  Every playing note maps its MIDI pitch to a row on the Joy Division waveform and injects energy that decays over time, bleeding into neighboring rows so chords spread across the canvas. Notes that collide on the same row get nudged apart so every note stays visible as the song ripples through. Low notes render warm, high notes cool.
                </p>
              </section>

              <section className="about-prose" style={{ marginTop: '48px' }}>
                <h2 className="about-h2">
                  THE WAVEFORM
                </h2>
                <p>
                  The background canvas draws the same stacked-line plot as Joy Division&apos;s Unknown Pleasures cover. That image traces back to radio observations of PSR B1919+21 — the first pulsar ever discovered, announced in a 1968 Nature paper. A city-sized neutron star spinning like a lighthouse, throwing a radio pulse our way every 1.3 seconds, so regular the discovery team half-jokingly dubbed the source LGM-1, for little green men. On the canvas, each row is filled beneath its curve to occlude the row behind it — same layered depth as the original — and animated with layered sine functions that shift over time.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
