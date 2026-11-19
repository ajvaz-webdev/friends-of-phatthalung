'use client';
// Floating buttons in the corner: a "Visit" shortcut, the Sections menu and
// back-to-top. They stay tucked away while the opening photo/header is on screen.
import { useEffect, useState } from 'react';

export default function PageTools({ links, visitHref }: { links: { href: string; label: string; divider?: boolean }[]; visitHref: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const top = document.getElementById('top');
      setVisible(window.scrollY > (top ? top.offsetHeight * 0.6 : 400));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return (
    <div className={visible ? 'page-tools' : 'page-tools is-tucked'} aria-label="Page navigation">
      <a className="floating-visit" href={visitHref}>Visit us</a>
      <details className="section-jump">
        <summary><span aria-hidden="true">☰</span><span className="section-jump-label">Sections</span></summary>
        <nav aria-label="Jump to a section" onClick={event => { const menu = event.currentTarget.closest('details'); if (menu) menu.open = false; }}>
          {links.map(link => link.divider
            ? <span key={link.label} className="section-jump-divider">{link.label}</span>
            : <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
      </details>
      <a className="floating-top" href="#top" aria-label="Back to the top"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6" /></svg></a>
    </div>
  );
}
