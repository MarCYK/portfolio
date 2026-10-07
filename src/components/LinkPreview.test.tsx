import { expect, test, describe, afterEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import LinkPreview from './LinkPreview';

afterEach(() => {
  cleanup();
});

describe('LinkPreview', () => {
  test('renders fetched title, description and arrow icon in an external anchor card', () => {
    const url = 'https://github.com/MarCYK/FYP_BIM_Model';
    const { container } = render(
      <LinkPreview url={url} meta={{ title: 'GitHub - MarCYK/FYP_BIM_Model', description: 'A BIM model project.' }} />,
    );

    const anchor = container.querySelector(`a[href="${url}"]`);
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('target')).toBe('_blank');
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');

    expect(anchor?.classList.contains('w-full')).toBe(true);
    expect(anchor?.classList.contains('max-w-md')).toBe(false);

    const title = anchor?.querySelector('span.text-sm');
    expect(title?.classList.contains('line-clamp-2')).toBe(true);

    expect(container.textContent).toContain('GitHub - MarCYK/FYP_BIM_Model');
    expect(container.textContent).toContain('A BIM model project.');
    expect(anchor?.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).not.toContain(url);
  });

  test('wraps the card anchor in a block span that fills the text column without centering', () => {
    const url = 'https://github.com/MarCYK/FYP_BIM_Model';
    const { container } = render(<LinkPreview url={url} meta={{ title: 'Repo', description: 'A repo.' }} />);

    const anchor = container.querySelector<HTMLAnchorElement>(`a[href="${url}"]`);
    expect(anchor).not.toBeNull();

    const wrapper = anchor?.closest('span');
    expect(wrapper).not.toBeNull();
    expect(wrapper).toBe(anchor?.parentElement);
    expect(wrapper?.classList.contains('block')).toBe(true);
    expect(wrapper?.classList.contains('my-4')).toBe(true);
    expect(wrapper?.classList.contains('my-1')).toBe(false);
    expect(wrapper?.classList.contains('text-center')).toBe(false);
    expect(anchor?.classList.contains('my-1')).toBe(false);
  });

  test('falls back to friendly host labels when meta is null or omitted', () => {
    const { container } = render(
      <>
        <LinkPreview url="https://github.com/MarCYK/FYP_BIM_Model" meta={null} />
        <LinkPreview url="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5766993" meta={null} />
        <LinkPreview url="https://example.com/post" />
      </>,
    );

    expect(container.textContent).toContain('GitHub');
    expect(container.textContent).toContain('SSRN');
    expect(container.textContent).toContain('example.com');
  });

  test('renders no description element when meta has no description', () => {
    const { container } = render(
      <LinkPreview url="https://github.com/MarCYK/MySignMate" meta={{ title: 'Repo', description: null }} />,
    );

    expect(container.textContent).toContain('Repo');
    expect(container.querySelector('span.text-xs.line-clamp-2')).toBeNull();
  });

  test('clamps long descriptions to two lines', () => {
    const longDescription = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor '.repeat(3).trim();
    const { container } = render(
      <LinkPreview url="https://example.com/post" meta={{ title: 'A very long article', description: longDescription }} />,
    );

    const clamped = container.querySelector('span.text-xs.line-clamp-2');
    expect(clamped).not.toBeNull();
    expect(clamped?.textContent).toContain('lorem ipsum');
  });

  test('renders a plain anchor with the raw string for unparseable URLs', () => {
    const { container } = render(<LinkPreview url="not a url" />);

    const anchor = container.querySelector('a');
    expect(anchor).not.toBeNull();
    expect(anchor?.textContent).toBe('not a url');
  });
});
