/* ============================================================
   finethought.com.au — SVG Icon Components
   Extracted from DOM on 2026-03-27
   ============================================================ */

import { SVGProps } from "react";

type SVGComponentProps = SVGProps<SVGSVGElement>;

/* Close / X icon — button.c-gui__panel__header__button--close */
export function CloseIcon(props: SVGComponentProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* Sun / Light mode toggle icon — button.c-gui__panel__header__button--light-mode */
export function SunIcon(props: SVGComponentProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

/* Sidebar / panel layout toggle icon — button.c-gui__panel__header__button--sidebar
   Mimics a two-panel layout icon (viewBox 0 0 200 200) */
export function SidebarIcon(props: SVGComponentProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="14"
      height="14"
      fill="currentColor"
      {...props}
    >
      {/* Outer rectangle */}
      <rect
        x="10"
        y="30"
        width="180"
        height="140"
        rx="8"
        ry="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
      />
      {/* Vertical divider — left panel indicator */}
      <line
        x1="70"
        y1="30"
        x2="70"
        y2="170"
        stroke="currentColor"
        strokeWidth="14"
      />
    </svg>
  );
}

/* Arrow right icon — used inline in display text (→) */
export function ArrowRightIcon(props: SVGComponentProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 24"
      width="20"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="4" y1="12" x2="36" y2="12" />
      <polyline points="26 4 36 12 26 20" />
    </svg>
  );
}

/* Logo mark — the double-slash logo "//---" used in the page title */
export function LogoIcon(props: SVGComponentProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 24"
      width="30"
      height="12"
      fill="currentColor"
      {...props}
    >
      {/* Two slash marks */}
      <text
        x="0"
        y="18"
        fontFamily="code-saver, monospace"
        fontSize="18"
        fontWeight="400"
      >
        //
      </text>
    </svg>
  );
}
