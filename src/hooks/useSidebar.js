import { useState, useEffect } from 'react';

export function useSidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toggle = () => setOpen(v => !v);
  const close = () => setOpen(false);

  return { open, toggle, close };
}