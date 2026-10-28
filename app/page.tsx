import { site } from '@/content/site';
import { SkipLink } from '@/components/ui/SkipLink';
import { Header } from '@/components/layout/Header';

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content">
        <h1>{site.name}</h1>
      </main>
    </>
  );
}
