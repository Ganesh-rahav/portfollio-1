import { Section } from '@/components/ui/Section';

export function About() {
  return (
    <Section id="about" eyebrow="01 · About" className="about">
      <h2 className="section-headline">
        A student from Trichy, <span className="hl">building a company while I study.</span>
      </h2>
      <p className="about-paragraph">
        {
          "I'm completing a B.Sc. in Information Technology with Cybersecurity at Jamal Mohamed College while building Tranzora Digital as co-founder and CTO. I learn by building things that have to work."
        }
      </p>
      <div className="about-facts">
        <div className="about-fact">
          <span className="eyebrow">Based in</span>
          <p>Trichy, Tamil Nadu, India</p>
        </div>
        <div className="about-fact">
          <span className="eyebrow">Studying</span>
          <p>B.Sc. IT with Cybersecurity, class of 2027</p>
        </div>
        <div className="about-fact">
          <span className="eyebrow">Building</span>
          <p>Tranzora Digital</p>
        </div>
      </div>
    </Section>
  );
}
