import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Reveal } from '@/components/ui/Reveal';
import { SkipLink } from '@/components/ui/SkipLink';
import { Header } from '@/components/layout/Header';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const SWATCHES: Array<{ label: string; className: string }> = [
  { label: 'bg', className: 'bg-bg' },
  { label: 'surface', className: 'bg-surface' },
  { label: 'line', className: 'bg-line' },
  { label: 'text', className: 'bg-text' },
  { label: 'muted', className: 'bg-muted' },
  { label: 'muted-large', className: 'bg-muted-large' },
  { label: 'accent', className: 'bg-accent' },
  { label: 'button-fill', className: 'bg-button-fill' },
];

const TYPE_SAMPLES: Array<{ label: string; token: string }> = [
  { label: 'eyebrow (12px)', token: 'var(--text-eyebrow)' },
  { label: 'tag (15px)', token: 'var(--text-tag)' },
  { label: 'button (16px)', token: 'var(--text-button)' },
  { label: 'body (18/17px)', token: 'var(--text-body)' },
  { label: 'body-lg (20/18px)', token: 'var(--text-body-lg)' },
  { label: 'step title (30px)', token: 'var(--text-step-title)' },
  { label: 'Tranzora headline (48/34px)', token: 'var(--text-tranzora-headline)' },
  { label: 'section headline (60/38px)', token: 'var(--text-section-headline)' },
  { label: 'contact headline (92/46px)', token: 'var(--text-contact-headline)' },
  { label: 'name (152/76px)', token: 'var(--text-name)' },
];

export default function StyleguidePage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <>
      <SkipLink />

      <main id="main-content">
        <Container>
          <div className="flex items-center justify-between gap-4 pt-10">
            <div>
              <Eyebrow>Styleguide — dev only</Eyebrow>
              <h1 className="mt-2">Design system</h1>
              <p className="mt-1 text-muted">
                Not indexed, excluded from the (future) sitemap, 404s in production builds.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </Container>

        <Section id="tokens" eyebrow="Tokens — color">
          <div className="flex flex-wrap gap-4">
            {SWATCHES.map((swatch) => (
              <div key={swatch.label} className="flex flex-col gap-2">
                <div className={`h-16 w-16 rounded-sm border border-line ${swatch.className}`} />
                <span className="text-muted text-[length:var(--text-tag)]">{swatch.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 demo-muted-large">
            Muted-large (30px, 3:1) — only safe at 24px or larger.
          </p>
        </Section>

        <Section id="type" eyebrow="Tokens — type scale" className="pt-0">
          <div className="flex flex-col gap-4">
            {TYPE_SAMPLES.map((sample) => (
              <div key={sample.label} className="border-b border-line pb-4">
                <p className="text-muted text-[length:var(--text-tag)]">{sample.label}</p>
                <p className="mt-1" style={{ fontSize: sample.token }}>
                  Ganesh Rahav
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="buttons" eyebrow="Button" className="pt-0">
          <div className="flex flex-wrap items-center gap-4">
            <Button href="https://tranzora.digital">Visit tranzora.digital</Button>
            <Button href="https://tranzora.digital" variant="filled">
              Visit tranzora.digital
            </Button>
            <Button href="https://tranzora.digital" variant="filled" icon="arrow">
              Visit tranzora.digital
            </Button>
            <Button type="button">Plain button</Button>
          </div>
        </Section>

        <Section id="tags" eyebrow="Tag" className="pt-0">
          <div className="flex flex-wrap gap-3">
            <Tag>Tranzora Digital</Tag>
            <Tag>B.Sc. IT · Cybersecurity</Tag>
            <Tag variant="accent">Co-founder &amp; CTO</Tag>
          </div>
        </Section>

        <Section id="reveal" eyebrow="Reveal" className="pt-0">
          <p className="text-muted">
            Scroll — each box fades and rises once, the first time it enters view.
          </p>
          <div className="mt-6 flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <Reveal key={n} className="rounded-md border border-line bg-surface p-6">
                Reveal block {n}
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="header" eyebrow="Header, toggles, menu" className="pt-0">
          <p className="text-muted">
            Real, interactive instance — sound toggle, theme toggle and the full-screen menu all
            work here exactly as they do on the homepage.
          </p>
          <div className="demo-frame mt-6">
            <Header />
          </div>
        </Section>

        <Section id="skip-link" eyebrow="Skip link" className="pt-0">
          <p className="text-muted">
            Tab from the very top of this page — the skip link above is the real one for this page.
          </p>
        </Section>
      </main>
    </>
  );
}
