export function SkillsSection() {
  return (
    <section className="c-skills" style={{ marginTop: '3rem', position: 'relative' }}>
      {/* "Skills" background display text — absolutely positioned behind content */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '2rem',
          left: 0,
          right: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
          color: 'var(--ft-text-faded-bg)',
          fontFamily: '"neue-haas-grotesk-display", serif',
          fontWeight: 600,
          fontSize: 'clamp(80px, 16vw, 230px)',
          lineHeight: 1,
          letterSpacing: '-0.0325em',
          whiteSpace: 'nowrap',
          textAlign: 'right',
          transition: 'color 0.25s',
        }}
      >
        Skills
      </div>

      {/* ASCII Divider */}
      <pre className="c-ascii" style={{ position: 'relative', zIndex: 1 }}>
        {`//-----------------------------------------------------------//
//                                                           //
//  * * * * * * * * * * * * * * * * * * * * * * * * * * *   //
//                                                           //
//-----------------------------------------------------------//`}
      </pre>

      {/* Skills table */}
      <div className="c-editor" style={{ marginTop: '1.5rem', overflowX: 'auto', position: 'relative', zIndex: 1 }}>
        <pre className="c-editor-table">
          <span className="c-editor-table__header">PROFESSIONAL SKILLS{'\n'}</span>
          <span className="c-editor-table__label">{'====================\n'}</span>
          <span className="c-editor-table__header">{'DEVELOPMENT        / CMS PLATFORM      / DESIGN            / ADMIN\n'}</span>
          <span className="c-editor-table__label">{'-------------------+-------------------+-------------------+---------\n'}</span>
          {`Next.js / React    / WordPress         / Figma             / GitHub\n`}
          {`HTML5 / SCSS       / WooCommerce       / Adobe XD          / Trello\n`}
          {`PHP                / Sanity            / Webflow           / Asana\n`}
          {`Liquid             / Craft             / Photoshop         / Slack\n`}
          {`JavaScript         / Shopify           / Illustrator       / Acrobat`}
        </pre>
      </div>
    </section>
  );
}
