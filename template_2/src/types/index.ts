export interface Project {
  title: string;
  description: string;
  date: string;
  href: string;
  external?: boolean;
  icon?: string;
}

export interface Post {
  date: string;
  title: string;
  href: string;
}

export interface PostSection {
  label: string;
  posts: Post[];
}

export interface NavLink {
  href: string;
  label: string;
}
