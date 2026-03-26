export function SkillsSection() {
  return (
    <section className="c-skills" style={{ marginTop: '3rem' }}>
      {/* ASCII Divider */}
      <pre className="c-ascii">
        {`//-----------------------------------------------------------//
//                                                           //
//  * * * * * * * * * * * * * * * * * * * * * * * * * * *   //
//                                                           //
//-----------------------------------------------------------//`}
      </pre>

      {/* Skills table */}
      <div className="c-editor" style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
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
