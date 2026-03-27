import type { Metadata } from 'next';
import MobileMenu from '@/components/MobileMenu';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { EnvelopeOutlineIcon, LinkedInLogoIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'marcyk - About',
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <MobileMenu />
      <main id="scroll-root" className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full flex-1 flex-col px-6 sm:px-8" style={{ maxWidth: '80rem' }}>
          <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:gap-0">
            <div className="shrink-0 pb-8 pt-12 lg:w-1/4 lg:pr-12 lg:pt-20 xl:pr-24">
              <h1 className="page-heading mb-3">
                About
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Existentially ambiguous.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <details className="about-details" open>
                  <summary className="tree-label">Contact</summary>
                  <ul className="tree-children">
                    <li>
                      <a href="mailto:zach@wvrk.org" className="about-link">
                        <EnvelopeOutlineIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                        zach@wvrk.org
                      </a>
                    </li>
                  </ul>
                </details>
                <details className="about-details" open>
                  <summary className="tree-label">Links</summary>
                  <ul className="tree-children">
                    <li>
                      <a
                        href="https://www.linkedin.com/in/marcyk/"
                        className="about-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedInLogoIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                        LinkedIn
                      </a>
                    </li>
                  </ul>
                </details>
              </div>
            </div>

            <div className="hidden w-px shrink-0 lg:block" style={{ borderLeft: '1px solid var(--border)' }} />

            <div className="flex-1 pb-28 pt-2 lg:pl-12 lg:pt-20 xl:pl-24">
              <div className="lg:max-w-xl" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                <h1 className="page-heading">
                  Zachary
                </h1>

                <section>
                  <p className="prose-content">
                    Zachary, a Senior Product Designer / Design Engineer at WarpStream working on <code>product</code>,{' '}
                    <code>ui/ux</code>, <code>frontend development</code>, <code>web</code> and <code>gtm</code>{' '}
                    initiatives.
                  </p>
                  <p className="prose-content">
                    I&apos;m entirely motivated by making sense of it all. In the existential sense.
                  </p>
                </section>

                <section>
                  <h2 className="section-label">
                    THE PIANO
                  </h2>
                  <div className="prose-content">
                    <p>
                      The piano song on the homepage is a cover of Maxence Cyrin&apos;s solo piano rendition of the
                      Pixies&apos; &ldquo;Where Is My Mind,&rdquo; sourced from an OnlineSequencer.net arrangement whose
                      protobuf-encoded note data was decoded with a custom Python script to extract all 527 note
                      events. The sequencer runs at 80 BPM inside the <code>requestAnimationFrame</code> loop so audio
                      and visuals fire in the same tick with zero drift. Each note plays through the MusyngKite acoustic
                      grand piano soundfont loaded via soundfont-player, with volume shaping that boosts melody, cuts
                      bass, and softens high notes.
                    </p>
                    <p>
                      Every playing note maps its MIDI pitch to a row on the Joy Division waveform and injects energy
                      that decays over time, bleeding into neighboring rows so chords spread across the canvas.
                      Simultaneous notes that collide on the same row get nudged apart so every note stays visible as
                      the song ripples through. Low notes render warm, high notes cool.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="section-label">
                    THE WAVEFORM
                  </h2>
                  <div className="prose-content">
                    <p>
                      The background canvas draws a stacked-line waveform modeled after the Unknown Pleasures album
                      cover by Joy Division, itself a plot of radio pulses from the pulsar CP 1919. Each row is filled
                      beneath its curve to occlude the row behind it, producing the same layered depth as the original.
                      The waveform is continuously animated with layered sine functions that shift over time.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
