export function ContactSection() {
  return (
    <section className="c-contact" style={{ marginTop: '3rem', paddingBottom: '4rem' }}>
      {/* Contact top block */}
      <div id="home-contact-top" className="c-sans c-sans--right c-sans--color-2">
        <p>
          <span className="c-sans__line c-sans__line--0">
            <span className="c-sans__line__content" style={{ fontSize: 'clamp(16px, 2.2vw, 36px)', letterSpacing: '-0.02em' }}>
              I am currently working /
            </span>
          </span>
          <span className="c-sans__line c-sans__line--1">
            <span className="c-sans__line__content" style={{ fontSize: 'clamp(16px, 2.2vw, 36px)', letterSpacing: '-0.035em' }}>
              alongside agencies from /
            </span>
          </span>
          <span className="c-sans__line c-sans__line--2">
            <span className="c-sans__line__content" style={{ fontSize: 'clamp(16px, 2.2vw, 36px)' }}>
              all over the world in a /
            </span>
          </span>
          <span className="c-sans__line c-sans__line--3">
            <span className="c-sans__line__content" style={{ fontSize: 'clamp(16px, 2.2vw, 36px)' }}>
              freelance capacity.
            </span>
          </span>
        </p>
      </div>

      {/* CTA link */}
      <div style={{ textAlign: 'right', marginTop: '1rem', paddingRight: '0' }}>
        <a href="/contact" className="c-link">
          → Contact me
        </a>
      </div>

      {/* Contact bottom block */}
      <div id="home-contact-bottom" className="c-sans c-sans--right c-sans--color-2" style={{ marginTop: '2rem' }}>
        <p>
          <span className="c-sans__line c-sans__line--0">
            <span className="c-sans__line__content" style={{ fontSize: 'clamp(16px, 2.2vw, 36px)' }}>
              Seeking to partner with /
            </span>
          </span>
          <span className="c-sans__line c-sans__line--1">
            <span className="c-sans__line__content" style={{ fontSize: 'clamp(16px, 2.2vw, 36px)' }}>
              agencies and designers /
            </span>
          </span>
          <span className="c-sans__line c-sans__line--2">
            <span className="c-sans__line__content" style={{ fontSize: 'clamp(16px, 2.2vw, 36px)' }}>
              on an ongoing basis.
            </span>
          </span>
        </p>
      </div>
    </section>
  );
}
