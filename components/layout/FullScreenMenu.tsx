'use client';

import { useEffect, useRef, type RefObject } from 'react';

type FullScreenMenuProps = {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#tranzora', label: 'Tranzora Digital' },
  { href: '#how', label: 'How I work' },
  { href: '#contact', label: 'Contact' },
];

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function FullScreenMenu({ open, onClose, triggerRef }: FullScreenMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const focusable = dialog ? getFocusableElements(dialog) : [];
    focusable[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialog) return;

      const elements = getFocusableElements(dialog);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Esc, a link click, or unmount while open all return focus here.
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  return (
    <div
      ref={dialogRef}
      className="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      hidden={!open}
    >
      <div className="wrap">
        <nav className="menu-nav" aria-label="Section links">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="menu-link" onClick={onClose}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
