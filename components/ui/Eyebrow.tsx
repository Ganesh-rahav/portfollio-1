import type { ReactNode } from 'react';

type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function Eyebrow({ children, className }: EyebrowProps) {
  const classes = ['eyebrow', className].filter(Boolean).join(' ');
  return <span className={classes}>{children}</span>;
}
