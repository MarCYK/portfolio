/* ASCII background texture — decorative code-comment pattern
   Fills the page background like a code editor with many lines of characters */

const PATTERN_ROWS = 40;

function generateASCIIRow(rowIndex: number): string {
  const patterns = [
    '//  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  //  ',
    '//  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  //  ',
    '//  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  =  //  ',
    '//  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  +  //  ',
    '/*  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  */',
    '//  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  //  ',
  ];
  return patterns[rowIndex % patterns.length];
}

export function ASCIIBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.35,
      }}
    >
      <pre
        style={{
          fontFamily: '"code-saver", sans-serif',
          fontWeight: 400,
          fontSize: '0.75rem',
          lineHeight: '0.9375rem',
          color: 'var(--ft-text-faint)',
          whiteSpace: 'pre',
          transition: 'color 0.25s',
          margin: 0,
          padding: 0,
        }}
      >
        {Array.from({ length: PATTERN_ROWS }, (_, i) => generateASCIIRow(i)).join('\n')}
      </pre>
    </div>
  );
}
