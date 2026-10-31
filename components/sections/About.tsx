import Image from 'next/image';
import aboutPhoto from '../../assets/about-ganesh-original.jpg';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { DotOrb } from '@/components/about/DotOrb';

const FACTS = [
  { label: 'Based in', value: 'Trichy, Tamil Nadu, India' },
  { label: 'Studying', value: 'B.Sc. IT with Cybersecurity, class of 2027' },
  { label: 'Building', value: 'Co-founder & CTO, Tranzora Digital' },
];

export function About() {
  return (
    <section id="about" className="sec about">
      <Container>
        <Reveal>
          <div className="about-frame">
            <div className="about-cell about-cell-headline">
              <Eyebrow>01 · About</Eyebrow>
              <h2 className="about-headline">
                A student from Trichy, <span className="hl">building a company while I study.</span>
              </h2>
            </div>

            <div className="about-cell about-cell-photo">
              <Image
                src={aboutPhoto}
                alt="Ganesh Rahav"
                className="about-photo-img"
                sizes="(min-width: 760px) 36vw, 100vw"
                loading="lazy"
              />
            </div>

            <div className="about-cell about-cell-paragraph">
              <p>
                {
                  "I'm completing a B.Sc. in Information Technology with Cybersecurity at Jamal Mohamed College while building Tranzora Digital as co-founder and CTO. I learn by building things that have to work."
                }
              </p>
            </div>

            <div className="about-cell about-cell-orb">
              <DotOrb />
            </div>

            <div className="about-cell about-cell-facts">
              {FACTS.map((fact) => (
                <div key={fact.label} className="about-fact">
                  <span className="eyebrow">{fact.label}</span>
                  <p>{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
