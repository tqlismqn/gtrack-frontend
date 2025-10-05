import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DemoButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(process.env.NEXT_PUBLIC_SHOW_DEMO === '1');
  }, []);
  if (!show) return null;
  return (
    <Link
      href="/demo/"
      aria-label="Open Demo"
      style={{
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: 9999,
        padding: '10px 14px',
        borderRadius: '999px',
        background: 'var(--color-primary, #5a57ff)',
        color: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,.15)',
        fontWeight: 600,
      }}
    >
      🚀 Demo
    </Link>
  );
}
