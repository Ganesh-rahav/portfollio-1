'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FullScreenMenu } from './FullScreenMenu';

export function NavMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      {mounted &&
        createPortal(
          <FullScreenMenu open={open} onClose={() => setOpen(false)} triggerRef={burgerRef} />,
          document.body,
        )}
    </>
  );
}
