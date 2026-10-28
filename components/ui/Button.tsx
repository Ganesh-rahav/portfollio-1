import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonOwnProps = {
  variant?: 'outline' | 'filled';
  icon?: 'arrow';
  children: ReactNode;
  className?: string;
};

type ButtonProps = ButtonOwnProps &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>)
  );

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Button({ variant = 'outline', icon, children, className, ...rest }: ButtonProps) {
  const classes = ['btn', variant === 'filled' ? 'fill' : null, className]
    .filter(Boolean)
    .join(' ');
  const iconNode = icon === 'arrow' ? <ArrowIcon /> : null;

  if (rest.href) {
    const { href, ...anchorProps } = rest as {
      href: string;
    } & AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={classes} href={href} {...anchorProps}>
        {children}
        {iconNode}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
      {iconNode}
    </button>
  );
}
