import { expect, test, describe, mock } from 'bun:test';
import { render } from '@testing-library/react';
import ProjectsPage, { getProjectGridLayout } from './page';

// Mock PageShell
mock.module('@/components/PageShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('ProjectsPage', () => {
  test('renders the MySignMate card copy', () => {
    const { container } = render(<ProjectsPage />);
    const text = container.textContent ?? '';

    for (const expected of ['MySignMate', '95.8%']) {
      expect(text).toContain(expected);
    }
  });

  test('shows the sign-language icon on the MySignMate card', () => {
    const { container } = render(<ProjectsPage />);

    const card = container.querySelector('a.project-card[href="/projects/mysignmate"]');
    expect(card).not.toBeNull();

    const iconPath = card?.querySelector('div.card-icon svg path') ?? null;
    expect(iconPath?.getAttribute('d')?.startsWith('M 20.224609 1.3671875')).toBe(true);
  });

  test('labels the sections On the clock and On my spare time with no stale wording', () => {
    const { container } = render(<ProjectsPage />);
    const text = container.textContent ?? '';
    const headings = Array.from(container.querySelectorAll('h2')).map((heading) => heading.textContent);

    expect(text).toContain('Things I ship for the day job.');
    expect(text).toContain('Things I build for myself.');
    expect(headings).toContain('On the clock');
    expect(headings).toContain('On my spare time');
    expect(headings.indexOf('On the clock')).toBeLessThan(headings.indexOf('On my spare time'));
    for (const stale of ['Archive', 'Personal projects', 'Mostly nonsense preserved for posterity']) {
      expect(text).not.toContain(stale);
    }
    expect(container.querySelector('a.project-card[href="/projects/mysignmate"]')).not.toBeNull();
  });

  test('keeps the On the clock heading tight under the page header', () => {
    const { container } = render(<ProjectsPage />);
    const heading = Array.from(container.querySelectorAll('h2')).find((h) => h.textContent === 'On the clock');

    expect(heading?.parentElement?.className).toBe('flex items-baseline gap-3 pb-8 sm:pb-12');
  });

  test('renders the ChatMT Agent footer as date and status', () => {
    const { container } = render(<ProjectsPage />);
    const card = container.querySelector('a.project-card[href="#"]');
    const text = card?.textContent ?? '';

    expect(text).toContain('Present · Mettler Toledo');
  });

  test('renders the ZCode Model Router footer as date and status', () => {
    const { container } = render(<ProjectsPage />);
    const card = container.querySelector('a.project-card[href="/projects/zcode-model-router"]');
    const text = card?.textContent ?? '';

    expect(text).toContain('2026 · GPL-3.0 · adapted from opencode-model-router v1.3');
  });

  test('contains no stale MSL card copy', () => {
    const { container } = render(<ProjectsPage />);
    const text = container.textContent ?? '';

    for (const stale of ['Malaysian Sign Language App', '93% accuracy']) {
      expect(text).not.toContain(stale);
    }
  });

  test('renders the ZCode Model Router card under On my spare time', () => {
    const { container } = render(<ProjectsPage />);
    const text = container.textContent ?? '';

    expect(text).toContain('ZCode Model Router');
    expect(container.querySelector('a.project-card[href="/projects/zcode-model-router"]')).not.toBeNull();
  });

  test('orders the ZCode Model Router card before MySignMate in the personal grid', () => {
    const { container } = render(<ProjectsPage />);
    const hrefs = Array.from(container.querySelectorAll('a.project-card')).map((card) => card.getAttribute('href'));

    expect(hrefs).toContain('/projects/zcode-model-router');
    expect(hrefs).toContain('/projects/mysignmate');
    expect(hrefs.indexOf('/projects/zcode-model-router')).toBeLessThan(hrefs.indexOf('/projects/mysignmate'));
  });
});

describe('getProjectGridLayout', () => {
  test('N=1 renders one ghost spanning one md column and two lg columns', () => {
    const layout = getProjectGridLayout(1);

    expect(layout.cardClasses).toEqual(['']);
    expect(layout.stretchMd).toBe(false);
    expect(layout.stretchLg).toBe(false);
    expect(layout.ghost).toEqual({ count: 1, classes: 'hidden md:flex lg:flex lg:col-span-2' });
  });

  test('N=2 renders one lg-only ghost', () => {
    const layout = getProjectGridLayout(2);

    expect(layout.cardClasses).toEqual(['', '']);
    expect(layout.stretchMd).toBe(false);
    expect(layout.stretchLg).toBe(false);
    expect(layout.ghost).toEqual({ count: 1, classes: 'hidden lg:flex' });
  });

  test('N=3 stretches the last card across two columns at md', () => {
    const layout = getProjectGridLayout(3);

    expect(layout.cardClasses).toEqual(['', '', 'md:col-span-2 lg:col-span-1']);
    expect(layout.stretchMd).toBe(true);
    expect(layout.stretchLg).toBe(false);
    expect(layout.ghost).toEqual({ count: 0, classes: '' });
  });

  test('N=4 stretches the last card across three columns at lg', () => {
    const layout = getProjectGridLayout(4);

    expect(layout.cardClasses).toEqual(['', '', '', 'lg:col-span-3']);
    expect(layout.stretchMd).toBe(false);
    expect(layout.stretchLg).toBe(true);
    expect(layout.ghost).toEqual({ count: 0, classes: '' });
  });

  test('N=5 stretches the last card at md and renders one lg ghost', () => {
    const layout = getProjectGridLayout(5);

    expect(layout.cardClasses).toEqual(['', '', '', '', 'md:col-span-2 lg:col-span-1']);
    expect(layout.stretchMd).toBe(true);
    expect(layout.stretchLg).toBe(false);
    expect(layout.ghost).toEqual({ count: 1, classes: 'hidden lg:flex' });
  });

  test('N=6 fills both breakpoints cleanly', () => {
    const layout = getProjectGridLayout(6);

    expect(layout.cardClasses).toEqual(['', '', '', '', '', '']);
    expect(layout.stretchMd).toBe(false);
    expect(layout.stretchLg).toBe(false);
    expect(layout.ghost).toEqual({ count: 0, classes: '' });
  });

  test('N=7 stretches the last card at both md and lg', () => {
    const layout = getProjectGridLayout(7);

    expect(layout.cardClasses).toEqual(['', '', '', '', '', '', 'md:col-span-2 lg:col-span-3']);
    expect(layout.stretchMd).toBe(true);
    expect(layout.stretchLg).toBe(true);
    expect(layout.ghost).toEqual({ count: 0, classes: '' });
  });

  test('N=8 fills md cleanly and renders one lg ghost', () => {
    const layout = getProjectGridLayout(8);

    expect(layout.cardClasses).toEqual(['', '', '', '', '', '', '', '']);
    expect(layout.stretchMd).toBe(false);
    expect(layout.stretchLg).toBe(false);
    expect(layout.ghost).toEqual({ count: 1, classes: 'hidden lg:flex' });
  });

  test('N=0 renders one ghost spanning the full row at both breakpoints', () => {
    const layout = getProjectGridLayout(0);

    expect(layout.cardClasses).toEqual([]);
    expect(layout.stretchMd).toBe(false);
    expect(layout.stretchLg).toBe(false);
    expect(layout.ghost).toEqual({
      count: 1,
      classes: 'hidden md:flex md:col-span-2 lg:flex lg:col-span-3',
    });
  });
});

describe('ProjectsPage ghost slots', () => {
  test('work grid (N=1) renders one spanning more to come… ghost', () => {
    const { container } = render(<ProjectsPage />);
    const grids = container.querySelectorAll('.project-grid');

    expect(grids).toHaveLength(2);
    expect(grids[0].getAttribute('data-n')).toBe('1');

    const ghosts = grids[0].querySelectorAll('.project-grid-ghost');
    expect(ghosts).toHaveLength(1);
    const ghost = ghosts[0];
    expect(ghost.textContent).toBe('more to come…');
    expect(ghost.querySelector('a')).toBeNull();
    expect(ghost.classList.contains('project-card')).toBe(false);
    for (const className of ['md:flex', 'lg:flex', 'lg:col-span-2']) {
      expect(ghost.classList.contains(className)).toBe(true);
    }
  });

  test('spare-time grid (N=2) renders one lg-only ghost and keeps three anchor cards total', () => {
    const { container } = render(<ProjectsPage />);
    const grids = container.querySelectorAll('.project-grid');

    expect(grids[1].getAttribute('data-n')).toBe('2');
    const ghosts = grids[1].querySelectorAll('.project-grid-ghost');
    expect(ghosts).toHaveLength(1);
    expect(ghosts[0].textContent).toBe('more to come…');
    expect(ghosts[0].classList.contains('md:flex')).toBe(false);
    expect(ghosts[0].classList.contains('lg:flex')).toBe(true);
    expect(container.querySelectorAll('.project-grid-ghost')).toHaveLength(2);
    expect(container.querySelectorAll('a.project-card')).toHaveLength(3);
  });
});
