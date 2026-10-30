import type { ReactNode } from 'react';
import { Container } from './Container';
import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';

type SectionProps = {
  id?: string;
  eyebrow: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, children, className }: SectionProps) {
  const classes = ['sec', className].filter(Boolean).join(' ');
  return (
    <section id={id} className={classes}>
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Reveal>{children}</Reveal>
      </Container>
    </section>
  );
}
