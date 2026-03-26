'use client';

import { useEffect, useRef, useState } from 'react';

export function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayFontSize, setDisplayFontSize] = useState(200);
  const [heroFontSize, setHeroFontSize] = useState(60);

  useEffect(() => {
    const measure = () => {
      if (!contentRef.current) return;
      const width = contentRef.current.clientWidth;
      // "Fine" at 280px fills ~1400px container, scale proportionally
      setDisplayFontSize(Math.floor(width / 5));
      setHeroFontSize(Math.floor(width / 22));
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="c-page__background" ref={contentRef}>
      {/* Hero title */}
      <h1 className="c-sans c-sans--color-2">
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

      {/* "Fine Thought" display title */}
      <h2
        className="c-sans c-sans--large c-sans--right c-sans--color-2"
        style={{ overflow: 'hidden', marginTop: '1rem' }}
      >
        <span className="c-sans__line c-sans__line--0">
          <span
            className="c-sans__line__content"
            style={{ fontSize: `${displayFontSize}px` }}
          >
            Fine
          </span>
        </span>
        <span className="c-sans__line c-sans__line--1">
          <span
            className="c-sans__line__content"
            style={{ fontSize: `${displayFontSize}px` }}
          >
            Thought
          </span>
        </span>
      </h2>

      {/* Bio section */}
      <div
        id="home-intro"
        className="c-sans c-sans--right c-sans--color-2"
        style={{ marginTop: '2rem' }}
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
