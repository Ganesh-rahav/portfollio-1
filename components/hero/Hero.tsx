import Image from 'next/image';
import { site } from '@/content/site';
import { ChromaticText } from '@/components/ui/ChromaticText';
import { Tag } from '@/components/ui/Tag';
import { HeroReveal } from './HeroReveal';

export function Hero() {
  return (
    <section id="hero" className="hero">
      <div id="hero-media" className="hero-media">
        <div className="hero-layer hero-silhouette">
          <Image
            src="/hero/hero-silhouette.jpg"
            alt="Silhouette portrait of Ganesh Rahav against a soft green glow"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div id="hero-photo" className="hero-layer hero-photo">
          <Image src="/hero/hero-glow.jpg" alt="" aria-hidden="true" fill sizes="100vw" />
        </div>
        <div className="hero-ring" aria-hidden="true" />
      </div>

      <div className="hero-copy">
        <h1 className="hero-name">
          <ChromaticText text={site.name} />
        </h1>
        <p className="hero-tagline">
          As long as I live,
          <br />
          there are{' '}
          <span className="hero-infinity">
            <span className="sr-only">infinite</span>
            <svg
              className="hero-infinity-icon"
              viewBox="0 0 48 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M24 12 C24 12 18 3 11 3 C5 3 2 7.5 2 12 C2 16.5 5 21 11 21 C18 21 24 12 24 12 C24 12 30 3 37 3 C43 3 46 7.5 46 12 C46 16.5 43 21 37 21 C30 21 24 12 24 12 Z"
              />
            </svg>
          </span>{' '}
          chances.
        </p>
        <div className="hero-tags">
          <Tag variant="accent">Co-founder &amp; CTO</Tag>
          <Tag>Tranzora Digital</Tag>
          <Tag>B.Sc. IT · Cybersecurity</Tag>
          <Tag>Trichy, India</Tag>
        </div>
        <HeroReveal />
      </div>
    </section>
  );
}
