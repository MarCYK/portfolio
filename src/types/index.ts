export interface Project {
  title: string;
  description: string;
  date: string;
  href: string;
  external?: boolean;
  icon: string;
  status?: string;
  content?: string[];
}

export interface InternalProject extends Project {
  external: false;
  content: string[];
}

export interface Post {
  date: string;
  title: string;
  href: string;
  author?: string;
  content?: string[];
}
