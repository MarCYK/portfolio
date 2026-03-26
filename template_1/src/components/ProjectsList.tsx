'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Project {
  title: string;
  slug: string;
  design: string;
  cms: string;
  tech: string;
  image: string;      // filename in /images/
  video?: string;     // filename in /videos/ (optional)
}

const projects: Project[] = [
  {
    title: 'Arthur G',
    slug: 'arthur-g',
    design: 'Latitude Group',
    cms: 'WooCommerce',
    tech: 'Next.js + PHP',
    image: 'ArthurG-Home-Loop-1280x720.jpg',
    video: 'ArthurG-Home-Loop-480.mp4',
  },
  {
    title: 'Assembly Talent',
    slug: 'assembly-talent',
    design: 'Katrina Tesoriero',
    cms: 'WordPress + JobAdder',
    tech: 'Next.js + PHP',
    image: 'Home-Assembly-Talent-1280x720.jpg',
  },
  {
    title: 'Black Fridye',
    slug: 'black-fridye',
    design: 'For Good Design Lab',
    cms: 'Shopify',
    tech: 'HTML5/SCSS/JS + Liquid',
    image: 'Splash-Black-Fridye-1280x720.jpg',
    video: 'Splash-Black-Fridye-720.mp4',
  },
  {
    title: 'Bloomingdales',
    slug: 'bloomingdales-lighting',
    design: 'Latitude Group',
    cms: 'WooCommerce + MYOB',
    tech: 'React + PHP',
    image: 'bloomingdales-home-1280x720.jpg',
  },
  {
    title: 'Junglefy',
    slug: 'junglefy',
    design: 'For Good Design Lab',
    cms: 'Craft',
    tech: 'Next.js',
    image: 'Home-Loop-Junglefy-1-1280x720.jpg',
    video: 'Home-Loop-Junglefy-480-2.mp4',
  },
  {
    title: 'Kuwaii',
    slug: 'kuwaii',
    design: 'Fine Thought',
    cms: 'Shopify',
    tech: 'HTML5/SCSS/JS + Liquid',
    image: 'Home-Kuwaii-1280x720.jpg',
  },
  {
    title: 'More Air',
    slug: 'more-air',
    design: 'More Air',
    cms: 'Sanity',
    tech: 'Next.js',
    image: 'More-Air-Home-Loop-1280x720.jpg',
    video: 'More-Air-Home-Loop-480.mp4',
  },
  {
    title: 'Provider Store',
    slug: 'provider-store',
    design: 'For Good Design Lab',
    cms: 'Shopify',
    tech: 'HTML5/SCSS/JS + Liquid',
    image: 'Home-Provider-Store-1280x720.jpg',
  },
  {
    title: 'Stanislava Pinchuck',
    slug: 'stanislava-pinchuck',
    design: 'Beth Wilkinson Studio',
    cms: 'WordPress',
    tech: 'HTML5/SCSS/JS + PHP',
    image: 'Home-Stanislava-Pinchuk-1280x720.jpg',
  },
  {
    title: 'Studio Massive',
    slug: 'studio-massive',
    design: 'Latitude Group',
    cms: 'WordPress',
    tech: 'React + PHP',
    image: 'Home-Studio-Massive-1280x720.jpg',
  },
  {
    title: 'The Gallery',
    slug: 'the-gallery',
    design: 'The Gallery',
    cms: 'WordPress',
    tech: 'React + PHP',
    image: 'Home-The-Gallery-1280x720.jpg',
  },
];

function pad(str: string, n: number): string {
  return str.length >= n ? str.slice(0, n) : str + ' '.repeat(n - str.length);
}

export function ProjectsList() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [videoError, setVideoError] = useState<Record<string, boolean>>({});

  const activeProject = activeIndex !== null ? projects[activeIndex] : null;

  return (
    <section className="c-projects" style={{ marginTop: '3rem', position: 'relative' }}>
      {/* "Projects" background display text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '1rem',
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
        Projects
      </div>

      {/* Table header */}
      <div className="c-editor" style={{ overflowX: 'auto', position: 'relative', zIndex: 1 }}>
        <pre className="c-editor-table" style={{ display: 'inline-block' }}>
          <span className="c-editor-table__header">{'SELECTED PROJECTS\n'}</span>
          <span className="c-editor-table__label">{'==================\n'}</span>
          <span className="c-editor-table__header">
            {'WEBSITE              / DESIGN              / CMS / PLATFORM       / TECH\n'}
          </span>
          <span className="c-editor-table__label">
            {'----------------------+---------------------+----------------------+------------------\n'}
          </span>
        </pre>
      </div>

      {/* Project rows */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {projects.map((project, i) => {
          const isActive = activeIndex === i;
          const rowText = `\u2192 ${pad(project.title, 19)}/ ${pad(project.design, 19)}/ ${pad(project.cms, 21)}/ ${project.tech}`;

          return (
            <div
              key={project.slug}
              style={{ position: 'relative' }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Row highlight overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#2756c9',
                  mixBlendMode: 'soft-light',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.25s',
                  pointerEvents: 'none',
                }}
              />
              {/* Row content */}
              <a
                href={`/project/${project.slug}`}
                style={{
                  display: 'block',
                  fontFamily: '"code-saver", sans-serif',
                  fontSize: '0.75rem',
                  lineHeight: '0.9375rem',
                  color: 'var(--ft-text-muted)',
                  textDecoration: 'none',
                  whiteSpace: 'pre',
                  position: 'relative',
                  zIndex: 1,
                  cursor: 'pointer',
                }}
                onClick={(e) => e.preventDefault()}
              >
                {rowText}
              </a>
            </div>
          );
        })}
      </div>

      {/* Floating preview panel — desktop only */}
      {activeProject && (
        <div
          className="project-preview-panel"
          style={{
            position: 'fixed',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '480px',
            maxWidth: '33vw',
            zIndex: 200,
            borderRadius: '0.25rem',
            overflow: 'hidden',
            boxShadow: '0 0 1rem rgba(0,0,0,0.5)',
            aspectRatio: '16/9',
          }}
        >
          {/* Base image */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <Image
              src={`/images/${activeProject.image}`}
              alt={activeProject.title}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
              priority
            />
          </div>

          {/* Video overlay (for projects that have cinemagraph videos) */}
          {activeProject.video && !videoError[activeProject.video] && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <video
                key={activeProject.video}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={() =>
                  setVideoError((prev) => ({ ...prev, [activeProject.video!]: true }))
                }
              >
                <source src={`/videos/${activeProject.video}`} type="video/mp4" />
              </video>
            </div>
          )}

          {/* CTA overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.2)',
            }}
          >
            <span
              style={{
                fontFamily: '"code-saver", sans-serif',
                fontSize: '0.75rem',
                color: '#eaeaea',
                background: 'rgba(0,0,0,0.5)',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.1875rem',
                letterSpacing: '0.05em',
              }}
            >
              → Visit project
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
