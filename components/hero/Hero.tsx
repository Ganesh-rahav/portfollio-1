import Image from 'next/image';
import { site } from '@/content/site';
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
        <h1 className="hero-name">{site.name}</h1>
        <p className="hero-tagline">
          As long as I live,
          <br />
          there are{' '}
          <span className="hero-infinity">
            <span className="sr-only">infinite</span>
            <svg
              className="hero-infinity-icon"
              viewBox="0 8 24 8"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"
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
