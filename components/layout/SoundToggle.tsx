'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'sound-enabled';

function readStoredPreference(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeStoredPreference(enabled: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    // Storage unavailable (private mode, disabled cookies) — ignore.
  }
}

/** UI only — no audio engine yet. Wired to real clips in Sprint 6. */
export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(readStoredPreference());
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    writeStoredPreference(next);
  }

  return (
    <button
      type="button"
      className="ib"
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}
      onClick={toggle}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10v4h3.5L12 18V6L7.5 10H4z" />
        {enabled ? <path d="M16 9.5a4 4 0 0 1 0 5" /> : null}
        {enabled ? <path d="M18.5 7a7.5 7.5 0 0 1 0 10" /> : null}
      </svg>
    </button>
  );
}
