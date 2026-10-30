import { Section } from '@/components/ui/Section';

const STEPS = [
  { number: '01', title: 'Learn', description: 'Pick up what the project needs.' },
  { number: '02', title: 'Build', description: 'Make a real version, not a demo.' },
  { number: '03', title: 'Test', description: 'Break it before a user does.' },
  { number: '04', title: 'Ship', description: 'Put it live, then start again.' },
];

export function HowIWork() {
  return (
    <Section id="how" eyebrow="03 · How I work">
      <h2 className="section-headline">Learn by building.</h2>
      <div className="how-steps">
        {STEPS.map((step, index) => (
          <div
            key={step.number}
            className={['how-step', index === STEPS.length - 1 ? 'is-last' : null]
              .filter(Boolean)
              .join(' ')}
          >
            <b>{step.number}</b>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
