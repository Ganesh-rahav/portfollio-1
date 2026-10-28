import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import { site } from '@/content/site';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import '@/styles/globals.css';

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-hanken',
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: `${site.role}, based in Trichy.`,
};

// Applied before first paint so a stored theme choice never flashes the
// default. Safe under the existing CSP (script-src allows 'unsafe-inline').
const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = window.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.dataset.theme = stored;
    }
  } catch (e) {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={hankenGrotesk.variable}
      // The inline script below sets data-theme from localStorage before
      // hydration; without this, React's hydration reconciliation would
      // revert it back to the server-rendered "dark" default.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        {children}
        <SmoothScroll />
      </body>
    </html>
  );
}
