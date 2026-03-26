/* ============================================================
   finethought.com.au — TypeScript Interfaces
   ============================================================ */

export interface Project {
  id: string;
  slug: string;
  title: string;
  type: string;
  subtitle?: string;
  intro?: string;
  design: string;      // design agency/person
  cms: string;         // CMS platform used
  tech: string;        // tech stack
  previews?: ProjectPreview[];
}

export interface ProjectPreview {
  image: {
    src: string;       // e.g. "ArthurG-Home-Loop"
    alt: string;
    width: number;
    height: number;
  };
  video?: {
    src480: string;    // e.g. "/videos/ArthurG-Home-Loop-480.mp4"
    src720: string;    // e.g. "/videos/ArthurG-Home-Loop-720.mp4"
  };
}

export interface SkillCategory {
  name: string;        // e.g. "DEVELOPMENT"
  items: string[];     // e.g. ["Next.js / React", "HTML5 / SCSS", ...]
}

export interface SiteData {
  projects: Project[];
  skills: SkillCategory[];
  contact: {
    top: string[];     // paragraphs for top contact block
    bottom: string[];  // paragraphs for bottom contact block
  };
  hero: {
    lines: string[];   // e.g. ["Web engineer /", "& creative coder"]
  };
  bio: {
    lines: string[];   // e.g. ["The creative persona /", "of Nathan Leigh Davis, /", ...]
    ctaText: string;   // e.g. "→ View profile"
    ctaHref: string;   // e.g. "/profile"
  };
}

export interface NavTab {
  label: string;
  href: string;
  active: boolean;
}
