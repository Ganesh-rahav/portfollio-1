import Image from 'next/image';
import { site } from '@/content/site';
import { SoundToggle } from './SoundToggle';
import { ThemeToggle } from './ThemeToggle';
import { NavMenu } from './NavMenu';

export function Header() {
  return (
    <div className="wrap hdr">
      <a className="brand" href="#top" aria-label={`${site.name}, home`}>
        <Image src="/brand/tranzora-logo.png" alt="" width={36} height={36} priority />
        <span>{site.name}</span>
      </a>
      <div className="hdr-r">
        <SoundToggle />
        <ThemeToggle />
        <NavMenu />
      </div>
    </div>
  );
}
