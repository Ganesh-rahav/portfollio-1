'use client';

import { useRef, useState } from 'react';
import { FullScreenMenu } from './FullScreenMenu';

export function NavMenu() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        className="burger"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <i />
        <i />
      </button>
      <FullScreenMenu open={open} onClose={() => setOpen(false)} triggerRef={burgerRef} />
    </>
  );
}
