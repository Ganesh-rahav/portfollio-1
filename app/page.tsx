import { SkipLink } from '@/components/ui/SkipLink';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/hero/Hero';
import { About } from '@/components/sections/About';
import { HowIWork } from '@/components/sections/HowIWork';

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content">
        <Hero />
        <div className="after-hero">
          <About />
          <section id="tranzora" className="tranzora-placeholder" />
          <HowIWork />
        </div>
      </main>
    </>
  );
}
