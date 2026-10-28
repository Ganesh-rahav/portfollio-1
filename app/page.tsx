import { SkipLink } from '@/components/ui/SkipLink';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/hero/Hero';

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content">
        <Hero />
      </main>
    </>
  );
}
