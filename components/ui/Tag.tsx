import type { ReactNode } from 'react';

type TagProps = {
  children: ReactNode;
  variant?: 'outline' | 'accent';
  className?: string;
};

export function Tag({ children, variant = 'outline', className }: TagProps) {
  const classes = ['chip', variant === 'accent' ? 'g' : null, className].filter(Boolean).join(' ');
  return <span className={classes}>{children}</span>;
}
