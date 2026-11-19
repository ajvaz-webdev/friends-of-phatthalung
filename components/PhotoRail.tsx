'use client';
// A one-row, swipeable preview of a gallery on the home page, ending in a
// "see all" card that opens the full gallery page.
import { useRef } from 'react';
import type { Gallery, Photo } from '../app/photos';
import { photoCount } from '../app/photos';
import { ZoomImg } from './site';

export default function PhotoRail({ gallery, photos, number, tone }: { gallery: Gallery; photos: Photo[]; number: string; tone: 'sand' | 'sage' | 'forest' }) {
  const rail = useRef<HTMLDivElement>(null);
  const move = (direction: number) => rail.current?.scrollBy({ left: direction * rail.current.clientWidth * 0.8, behavior: 'smooth' });
  const total = photoCount(gallery);
  return (
    <section id={`preview-${gallery.slug}`} className={`rail-section is-${tone}`}>
      <div className="shell">
        <header className="rail-heading">
          <div>
            <p className="kicker"><span>{number}</span> {gallery.kicker}</p>
            <h2>{gallery.title} <em>{gallery.titleEm}</em></h2>
          </div>
          <div className="rail-side">
            <p>{gallery.intro}</p>
            <div className="rail-actions">
              <a className="rail-all" href={gallery.href}>See all {total} <span aria-hidden="true">→</span></a>
              <button onClick={() => move(-1)} aria-label="Previous photos">←</button>
              <button onClick={() => move(1)} aria-label="Next photos">→</button>
            </div>
          </div>
        </header>
      </div>
      <div className="rail" ref={rail} data-zoom-group="">
        {photos.map(photo => (
          <figure className="rail-card" key={photo.src}>
            <ZoomImg photo={photo} sizes="(max-width: 760px) 70vw, 320px" />
            <figcaption>{photo.label}</figcaption>
          </figure>
        ))}
        <a className="rail-card rail-more" href={gallery.href}>
          <span className="rail-more-count">+{total - photos.length}</span>
          <span>more photos in<br /><strong>{gallery.title} {gallery.titleEm}</strong></span>
          <span className="rail-more-go">Open gallery →</span>
        </a>
      </div>
    </section>
  );
}
