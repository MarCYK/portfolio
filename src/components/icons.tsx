import type { CSSProperties } from 'react';

export function LogoDiamond({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 512 464" fill="none">
      <rect width="295.603" height="295.603" transform="matrix(0.866025 0.5 -0.866025 0.5 256 167.508)" fill="#FF0000" />
      <path d="M256 167.508L0 315.31L256 0V167.508Z" fill="#FF0000" />
      <path d="M256 167.508L512 315.31L256 0V167.508Z" fill="#FF8181" />
      <path d="M256 463.111L0 315.31L256 0V463.111Z" fill="#FF8181" />
      <path d="M256 463.111L512 315.31L256 0V463.111Z" fill="#FF0000" />
    </svg>
  );
}
