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

export function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  );
}

export function EnvelopeOutlineIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
    </svg>
  );
}

export function EnvelopeFillIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M228.44,58.07l-80,144a8,8,0,0,1-13.39.28L100.07,155,49.66,186.34A8,8,0,0,1,38,178.75l24-152a8,8,0,0,1,12.93-5.08l168,112A8,8,0,0,1,228.44,58.07Z" />
    </svg>
  );
}

export function MusicNoteOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M210.3,56.34l-80-24A8,8,0,0,0,120,40V148.26A44,44,0,1,0,136,184V98.75l69.7,20.91A8,8,0,0,0,216,112V64A8,8,0,0,0,210.3,56.34ZM92,212a28,28,0,1,1,28-28A28,28,0,0,1,92,212ZM200,100.75,136,80.36V50.75L200,71.14Z" />
    </svg>
  );
}

export function MusicNoteFillIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M212.92,24.57l-80-24A8,8,0,0,0,122,8a8,8,0,0,0-8,8V148.26A44,44,0,1,0,130,184V98.75l65.08,19.52A8,8,0,0,0,206,120a8,8,0,0,0,8-8V32A8,8,0,0,0,212.92,24.57ZM86,212a28,28,0,1,1,28-28A28,28,0,0,1,86,212Z" />
    </svg>
  );
}

export function BroadcastOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M173.66,82.34a8,8,0,0,1,0,11.32C162.29,105,156,118,156,128s6.29,23,17.66,34.34a8,8,0,0,1-11.32,11.32C148.92,160.23,140,144.62,140,128s8.92-32.23,22.34-45.66A8,8,0,0,1,173.66,82.34Zm-80,11.32a8,8,0,0,0-11.32-11.32C68.92,95.77,60,111.38,60,128s8.92,32.23,22.34,45.66a8,8,0,0,0,11.32-11.32C82.29,151,76,138,76,128S82.29,105,93.66,93.66ZM205,51a8,8,0,0,0-11.31,11.31C207.81,76.43,216,101.57,216,128s-8.19,51.57-22.31,65.69A8,8,0,0,0,205,205c16.12-16.12,27-44.37,27-77S221.12,67.12,205,51ZM62.31,62.31A8,8,0,0,0,51,51C34.88,67.12,24,95.37,24,128s10.88,60.88,27,77a8,8,0,0,0,11.31-11.31C48.19,179.57,40,154.43,40,128S48.19,76.43,62.31,62.31ZM128,108a20,20,0,1,0,20,20A20,20,0,0,0,128,108Zm0,24a4,4,0,1,1,4-4A4,4,0,0,1,128,132Z" />
    </svg>
  );
}

export function BroadcastFillIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M173.66,82.34a8,8,0,0,1,0,11.32C162.29,105,156,118,156,128s6.29,23,17.66,34.34a8,8,0,0,1-11.32,11.32C148.92,160.23,140,144.62,140,128s8.92-32.23,22.34-45.66A8,8,0,0,1,173.66,82.34Zm-80,11.32a8,8,0,0,0-11.32-11.32C68.92,95.77,60,111.38,60,128s8.92,32.23,22.34,45.66a8,8,0,0,0,11.32-11.32C82.29,151,76,138,76,128S82.29,105,93.66,93.66ZM205,51a8,8,0,0,0-11.31,11.31C207.81,76.43,216,101.57,216,128s-8.19,51.57-22.31,65.69A8,8,0,0,0,205,205c16.12-16.12,27-44.37,27-77S221.12,67.12,205,51ZM62.31,62.31A8,8,0,0,0,51,51C34.88,67.12,24,95.37,24,128s10.88,60.88,27,77a8,8,0,0,0,11.31-11.31C48.19,179.57,40,154.43,40,128S48.19,76.43,62.31,62.31ZM128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152Z" />
    </svg>
  );
}

export function SunHorizonOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M16,144H32a8,8,0,0,0,0-16H16a8,8,0,0,0,0,16Zm208,0h16a8,8,0,0,0,0-16H224a8,8,0,0,0,0,16ZM128,72a8,8,0,0,0,8-8V48a8,8,0,0,0-16,0V64A8,8,0,0,0,128,72ZM58.34,82.34,47,71a8,8,0,0,0-11.32,11.32L47,93.66A8,8,0,0,0,58.34,82.34Zm150.98,0a8,8,0,0,0-11.32,11.32L209.33,104.97A8,8,0,1,0,220.65,93.65ZM128,88a48,48,0,0,0-48,48,8,8,0,0,0,16,0,32,32,0,0,1,64,0,8,8,0,0,0,16,0A48,48,0,0,0,128,88Zm104,64H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16Zm0,32H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

export function SunHorizonFillIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M240,136a8,8,0,0,0-8,8,8,8,0,0,1-16,0,88,88,0,0,0-176,0,8,8,0,0,1-16,0,8,8,0,0,0-16,0,24,24,0,0,0,24,24H224a24,24,0,0,0,24-24A8,8,0,0,0,240,136ZM128,72a8,8,0,0,0,8-8V48a8,8,0,0,0-16,0V64A8,8,0,0,0,128,72ZM58.34,82.34A8,8,0,0,0,69.66,71L58.34,59.66A8,8,0,0,0,47,71ZM197.66,82.34,209,71a8,8,0,0,0-11.32-11.32L186.34,71A8,8,0,0,0,197.66,82.34ZM232,176H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

export function PaintBrushOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M232,56a48.05,48.05,0,0,1-48,48c-19.63,0-35.75-9.61-47.19-22.14l-42.1,42.09A60.17,60.17,0,0,1,96,152a56,56,0,0,1-28.62,48.91C53.2,209.32,40,220.14,40,232a8,8,0,0,1-16,0c0-23.65,18.95-38.4,33.91-49.33A40,40,0,0,0,80,152a44.05,44.05,0,0,0-44-44,8,8,0,0,1,0-16,60.23,60.23,0,0,1,48.15,24L126.33,74C114,62.43,104,46.13,104,24a8,8,0,0,1,16,0c0,26.35,20.12,40,64,40A8,8,0,0,1,232,56Z" />
    </svg>
  );
}

export function PaintBrushFillIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M232,32a8,8,0,0,0-8,8c0,26.35-20.12,40-64,40a48.05,48.05,0,0,0-48,48v1.32L68.85,72.17A8,8,0,0,0,57.5,83.5l51.83,51.83C93.2,137.94,80,148.76,80,160a56,56,0,0,0,28.62,48.91c14.16,8.41,27.36,19.23,27.36,31.09a8,8,0,0,0,16,0c0-23.65-18.95-38.4-33.91-49.33A40,40,0,0,1,96,160a44.05,44.05,0,0,1,44-44h12a64.07,64.07,0,0,0,64-64h8A8,8,0,0,0,232,32Z" />
    </svg>
  );
}

export function TrashOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
    </svg>
  );
}

export function SpeakerOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM32,96H72v64H32ZM144,207.64,88,164.09V91.91l56-43.55Zm54-106.08a40,40,0,0,1,0,52.88,8,8,0,0,1-12-10.56,24,24,0,0,0,0-31.72,8,8,0,0,1,12-10.56ZM218,69.08a88,88,0,0,1,0,117.84,8,8,0,1,1-11.9-10.68,72,72,0,0,0,0-96.48A8,8,0,1,1,218,69.08Z" />
    </svg>
  );
}

export function SpeakerFillIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81Zm54,106.08a40,40,0,0,1-12,28.44,8,8,0,0,1-12-10.56,24,24,0,0,0,0-31.72,8,8,0,0,1,12-10.56A40,40,0,0,1,209.51,130.89ZM218,69.08a88,88,0,0,1,0,117.84,8,8,0,1,1-11.9-10.68,72,72,0,0,0,0-96.48A8,8,0,1,1,218,69.08Z" />
    </svg>
  );
}

export function SpeakerSlashOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L73.03,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V175.89l42.08,46.49a8,8,0,1,0,11.84-10.76ZM144,207.64,88,164.09V91.91ZM32,160V96H72v64ZM160,32a8,8,0,0,0-8,8V76.29a8,8,0,0,0,16,0V40A8,8,0,0,0,160,32Z" />
    </svg>
  );
}

export function SunOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

export function MoonOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106.06,106.06,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106.06,106.06,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z" />
    </svg>
  );
}

export function HomeOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.89,75.43.11.1Z" />
    </svg>
  );
}

export function CaretRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
    </svg>
  );
}

export function ArrowRightIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

export function MoleculeIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M200,152a48.05,48.05,0,0,0-38.87,20H94.87a48,48,0,1,0,0,16h66.26A48,48,0,1,0,200,152ZM56,224a32,32,0,1,1,32-32A32,32,0,0,1,56,224Zm144,0a32,32,0,1,1,32-32A32,32,0,0,1,200,224Zm0-128a32,32,0,0,1-31.22-25h-1.65a48,48,0,1,0,0,16h1.65A32,32,0,1,1,200,96ZM56,96a32,32,0,1,1,32,32A32,32,0,0,1,56,96Zm144-48a32,32,0,1,1-32-32A32,32,0,0,1,200,48Z" />
    </svg>
  );
}

export function FlaskIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M221.69,199.77,160,96.92V40h8a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16h8V96.92L34.31,199.77A16,16,0,0,0,48,224H208a16,16,0,0,0,13.72-24.23ZM100.57,104.43A8,8,0,0,0,104,97.6V40h48V97.6a8,8,0,0,0,3.43,6.83L187.71,128H68.29ZM48,208l22.06-64H185.94L208,208Z" />
    </svg>
  );
}

export function BookOpenIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A40.06,40.06,0,0,0,96,192Zm128,0H160a40.06,40.06,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z" />
    </svg>
  );
}

export function InstagramLogoIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
    </svg>
  );
}

export function FigmaLogoIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M136,128a40,40,0,1,1,40,40A40,40,0,0,1,136,128Zm-8-40h48V48H128ZM88,48A40,40,0,1,0,128,88,40,40,0,0,0,88,48ZM40,128a40,40,0,1,0,48-38.68V88H80a40,40,0,0,0-40,40Zm48,0a24,24,0,1,1-24-24A24,24,0,0,1,88,128Zm40,8v48a40,40,0,0,0,80,0V136Zm40,48a24,24,0,0,1-48,0V152h48Z" />
    </svg>
  );
}

export function GlobeIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM101.63,168h52.74C149,186.34,140,202.87,128,215.89,116,202.87,107,186.34,101.63,168ZM98,152a145.72,145.72,0,0,1,0-48h60a145.72,145.72,0,0,1,0,48ZM40,128a87.61,87.61,0,0,1,3.33-24H81.79a161.79,161.79,0,0,0,0,48H43.33A87.61,87.61,0,0,1,40,128ZM154.37,88H101.63C107,69.66,116,53.13,128,40.11,140,53.13,149,69.66,154.37,88Zm19.84,16h38.46a88.15,88.15,0,0,1,0,48H174.21a161.79,161.79,0,0,0,0-48Zm32.16-16H170.94a142.39,142.39,0,0,0-20.26-45A88.37,88.37,0,0,1,206.37,88ZM105.32,43A142.39,142.39,0,0,0,85.06,88H49.63A88.37,88.37,0,0,1,105.32,43ZM49.63,168H85.06a142.39,142.39,0,0,0,20.26,45A88.37,88.37,0,0,1,49.63,168Zm101.05,45a142.39,142.39,0,0,0,20.26-45h35.43A88.37,88.37,0,0,1,150.68,213Z" />
    </svg>
  );
}

export function BrainIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M248,120a48.05,48.05,0,0,0-32-45.28V72a40,40,0,0,0-62.1-33.34A40,40,0,0,0,72,64a40.49,40.49,0,0,0,.45,5.83A48,48,0,0,0,40,120a47.6,47.6,0,0,0,8,26.56V152a40,40,0,0,0,62.11,33.34,39.59,39.59,0,0,0,11.89,6.1V208a8,8,0,0,0,16,0V191.44a39.61,39.61,0,0,0,11.89-6.1A40,40,0,0,0,212,152v-5.44A47.6,47.6,0,0,0,248,120Zm-99.57,50.8A24,24,0,0,1,104,152a8,8,0,0,0-16,0,24,24,0,0,1-48,0v-8.28a8,8,0,0,0-4.66-7.26A32,32,0,0,1,56,88a8.16,8.16,0,0,0,5.66-2.34A8,8,0,0,0,64,80a24,24,0,0,1,46.4-8.73,8,8,0,0,0,15.2-5A40.56,40.56,0,0,0,104,64a24,24,0,0,1,40-17.9A8,8,0,0,0,152,40a8,8,0,0,0,3.56-6.68A24,24,0,0,1,200,48v8a8,8,0,0,0,4.66,7.26A32,32,0,0,1,200,120a8.16,8.16,0,0,0-5.66,2.34A8,8,0,0,0,192,128a8,8,0,0,0,0,16,8,8,0,0,0,8,8,24,24,0,0,1-48,0,8,8,0,0,0-1.43-4.56A8,8,0,0,0,148.43,170.8Z" />
    </svg>
  );
}

export function CompassIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-120.27L107.58,115.09a8.06,8.06,0,0,0-4.49,4.49L83.73,176.27A8,8,0,0,0,88,187a7.87,7.87,0,0,0,2.91.55,8,8,0,0,0,7.34-4.82l19.36-44.92,19.92-19.92,44.92-19.36a8,8,0,0,0-4.45-15.3Z" />
    </svg>
  );
}

export function SmileyIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-16-80a16,16,0,1,1-16-16A16,16,0,0,1,112,136Zm64,0a16,16,0,1,1-16-16A16,16,0,0,1,176,136Zm-1.07,34.49a8,8,0,0,1-3.42,10.78,72,72,0,0,1-67,0A8,8,0,0,1,108,166.51a56,56,0,0,0,52,0A8,8,0,0,1,174.93,170.49Z" />
    </svg>
  );
}

export function UserIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
    </svg>
  );
}

export function CalendarIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V208Z" />
    </svg>
  );
}

export function LinkIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L72.5,104.28A56,56,0,0,1,149.31,102a8,8,0,1,1-10.64,12,40,40,0,0,0-54.85,1.63L59.7,139.72a40,40,0,0,0,56.58,56.58l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56.06,56.06,0,0,0-79.22,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.58,56.58L172.18,140.4A40,40,0,0,1,117.32,142,8,8,0,1,0,106.7,154a56,56,0,0,0,76.78-2.26l24.12-24.12A56.06,56.06,0,0,0,207.62,48.38Z" />
    </svg>
  );
}

export function ArrowLeftIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

export function LinkedInLogoIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
      <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v96a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0ZM216,160v48a8,8,0,0,1-16,0V160a32,32,0,0,0-64,0v48a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A48,48,0,0,1,216,160ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z" />
    </svg>
  );
}
