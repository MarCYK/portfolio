import type { InternalProject, Project } from '@/types';
import { currentProjects, archiveProjects } from '@/data/projects';

const allProjects = [...currentProjects, ...archiveProjects];

function isInternalProject(project: Project): project is InternalProject {
  return project.external === false && Array.isArray(project.content);
}

export function getInternalProjectBySlug(slug: string): InternalProject | null {
  return (
    allProjects.find(
      (project): project is InternalProject => isInternalProject(project) && project.href === `/projects/${slug}`,
    ) ?? null
  );
}

export function getInternalProjectSlugs(): string[] {
  return allProjects.filter(isInternalProject).map((project) => project.href.replace('/projects/', ''));
}
