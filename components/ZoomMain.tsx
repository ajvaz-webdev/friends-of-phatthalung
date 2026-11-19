'use client';
// Wraps a page in <main> and opens any photo marked data-zoom in a full-screen
// viewer. Arrows, keyboard and swiping move through the other photos in the
// same group (the nearest element with data-zoom-group, or the whole page).
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type Shot = { src: string; alt: string; caption: string };

export default function ZoomMain({ children }: { children: ReactNode }) {
  const main = useRef<HTMLElement>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [index, setIndex] = useState(-1);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const open = index >= 0 && index < shots.length;

  const openFrom = (target: EventTarget | null) => {
    if (!(target instanceof HTMLImageElement) || !target.hasAttribute('data-zoom') || !main.current) return false;
    const scope = target.closest('[data-zoom-group]') ?? main.current;
    const images = Array.from(scope.querySelectorAll<HTMLImageElement>('img[data-zoom]'));
    setShots(images.map(image => ({ src: image.getAttribute('src') ?? image.src, alt: image.alt, caption: image.dataset.caption ?? '' })));
    setIndex(images.indexOf(target));
    return true;
  };

  const step = useCallback((direction: number) => {
    setIndex(current => (current + direction + shots.length) % shots.length);
  }, [shots.length]);
  const close = useCallback(() => setIndex(-1), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [open, step, close]);

  const shot = open ? shots[index] : null;
  return (
    <main
      ref={main}
      onClick={event => { openFrom(event.target); }}
      onKeyDown={event => {
        if ((event.key === 'Enter' || event.key === ' ') && openFrom(event.target)) event.preventDefault();
      }}
    >
      {children}
      {shot && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged photo"
          onClick={event => { event.stopPropagation(); if (event.target === event.currentTarget) close(); }}
          onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
          onTouchEnd={event => {
            if (!touch.current) return;
            const dx = event.changedTouches[0].clientX - touch.current.x;
            const dy = event.changedTouches[0].clientY - touch.current.y;
            touch.current = null;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
            else if (dy > 90) close();
          }}
        >
          <button className="lightbox-close" onClick={close} aria-label="Close enlarged photo">×</button>
          <img key={shot.src} src={shot.src} alt={shot.alt} />
          <p>{shot.caption || shot.alt}{shots.length > 1 && <span className="lightbox-count">{index + 1} / {shots.length}</span>}</p>
          {shots.length > 1 && (
            <>
              <button className="lightbox-arrow is-prev" onClick={() => step(-1)} aria-label="Previous photo">←</button>
              <button className="lightbox-arrow is-next" onClick={() => step(1)} aria-label="Next photo">→</button>
            </>
          )}
        </div>
      )}
    </main>
  );
}
