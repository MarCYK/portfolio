import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { Atom, BookOpen, Brain, Camera, Compass, FlaskConical, Globe, PenTool, Smile } from 'lucide-react';

export function LogoDiamond({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <Image
      src="/favicon.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        verticalAlign: 'middle',
        objectFit: 'contain',
        ...style,
      }}
      draggable={false}
      width={24}
      height={24}
    />
  );
}

export const PROJECT_ICONS: Record<string, ReactNode> = {
  atom: <Atom className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  flask: <FlaskConical className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  book: <BookOpen className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  camera: <Camera className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  pen: <PenTool className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  globe: <Globe className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  brain: <Brain className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  compass: <Compass className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  smile: <Smile className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
};
