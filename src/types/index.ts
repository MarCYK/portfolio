import type { ReactNode } from 'react';

export interface Project {
  title: string;
  description: string;
  date: string;
  href: string;
  external?: boolean;
  icon: ReactNode;
}

export interface Post {
  date: string;
  title: string;
  href: string;
}
