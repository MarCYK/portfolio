'use client';

import { useEffect, useRef, useState } from 'react';
import { ASCIIBackground } from './ASCIIBackground';

export function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayFontSize, setDisplayFontSize] = useState(200);
  const [heroFontSize, setHeroFontSize] = useState(60);

  useEffect(() => {
    const measure = () => {
      if (!contentRef.current) return;
      const width = contentRef.current.clientWidth;
      // "Fine Thought" fills ~5x the font size at 1440px (~280px)
      setDisplayFontSize(Math.floor(width / 5));
      // Hero "Web engineer" fills about 1/17 of width (~85px at 1440px)
      setHeroFontSize(Math.max(24, Math.floor(width / 17)));
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="c-page__background" ref={contentRef} style={{ position: 'relative' }}>
      {/* ASCII background texture */}
      <ASCIIBackground />

      {/* Hero title */}
      <h1 className="c-sans c-sans--color-2" style={{ position: 'relative', zIndex: 1 }}>
        <span className="c-sans__line c-sans__line--0">
          <span
            className="c-sans__line__content"
            style={{ fontSize: `${heroFontSize}px` }}
          >
            Web engineer /
          </span>
        </span>
        <span className="c-sans__line c-sans__line--1">
          <span
            className="c-sans__line__content"
            style={{ fontSize: `${heroFontSize}px` }}
          >
            &amp; creative coder
          </span>
        </span>
      </h1>

      {/* "Fine Thought" display title — large right-aligned, barely visible (#bababa on #282828) */}
      <h2
        className="c-sans c-sans--large c-sans--right"
        style={{ overflow: 'hidden', marginTop: '0.5rem', color: 'var(--ft-text-secondary)', position: 'relative', zIndex: 1 }}
      >
        <span className="c-sans__line c-sans__line--0">
          <span
            className="c-sans__line__content"
            style={{ fontSize: `${displayFontSize}px`, color: 'var(--ft-text-secondary)' }}
          >
            Fine
          </span>
        </span>
        <span className="c-sans__line c-sans__line--1">
          <span
            className="c-sans__line__content"
            style={{ fontSize: `${displayFontSize}px`, color: 'var(--ft-text-secondary)' }}
          >
            Thought
          </span>
        </span>
      </h2>

      {/* Bio section */}
      <div
        id="home-intro"
        className="c-sans c-sans--right c-sans--color-2"
        style={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}
      >
        <p>
          <span className="c-sans__line c-sans__line--0">
            <span
              className="c-sans__line__content"
              style={{
                fontSize: 'clamp(16px, 2.2vw, 36px)',
                letterSpacing: '-0.02em',
              }}
            >
              The creative persona /
            </span>
          </span>
          <span className="c-sans__line c-sans__line--1">
            <span
              className="c-sans__line__content"
              style={{
                fontSize: 'clamp(16px, 2.2vw, 36px)',
                letterSpacing: '-0.035em',
              }}
            >
              of Nathan Leigh Davis, /
            </span>
          </span>
          <span className="c-sans__line c-sans__line--2">
            <span
              className="c-sans__line__content"
              style={{ fontSize: 'clamp(16px, 2.2vw, 36px)' }}
            >
              a creative technologist &amp; /
            </span>
          </span>
          <span className="c-sans__line c-sans__line--3">
            <span
              className="c-sans__line__content"
              style={{ fontSize: 'clamp(16px, 2.2vw, 36px)' }}
            >
              front-end web engineer /
            </span>
          </span>
          <span className="c-sans__line c-sans__line--4">
            <span
              className="c-sans__line__content"
              style={{ fontSize: 'clamp(16px, 2.2vw, 36px)' }}
            >
              based in Victoria (AU)
            </span>
          </span>
        </p>
        <a href="/profile" className="c-link" style={{ justifyContent: 'flex-end' }}>
          → View profile
        </a>
      </div>
    </div>
  );
}
