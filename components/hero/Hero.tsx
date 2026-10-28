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
        <p className="hero-role">CTO of Tranzora Digital</p>
        <div className="hero-tags">
          <Tag variant="accent">Cybersecurity</Tag>
          <Tag>Web</Tag>
          <Tag>Tranzora</Tag>
        </div>
        <HeroReveal />
      </div>
    </section>
  );
}
