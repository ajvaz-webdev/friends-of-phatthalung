// Small pieces shared by the home page and the gallery pages. No state here,
// so these work in both server and client components.
import { galleries, photoCount, web } from '../app/photos';
import type { Item, Photo } from '../app/photos';
import { isClip } from '../app/photos';

export const pageLinks = [
  { href: '/things-to-do', label: 'Things to do' },
  { href: '/nature', label: 'Nature' },
  { href: '/moments', label: 'Moments' },
  { href: '/play', label: 'Play' },
];

/** One photo (or short video) with its caption. Photos open in the lightbox. */
export function Figure({ item, sizes, className }: { item: Item; sizes: string; className?: string }) {
  if (isClip(item)) {
    return (
      <figure className={`media-card is-video ${className ?? ''}`}>
        <video controls muted playsInline preload="none" poster={item.poster} aria-label={item.aria}>
          <source src={item.video} type="video/mp4" />
          Your browser does not support this short video.
        </video>
        <figcaption>{item.label}</figcaption>
      </figure>
    );
  }
  return (
    <figure className={`media-card ${className ?? ''}`}>
      <ZoomImg photo={item} sizes={sizes} />
      <figcaption>{item.label}</figcaption>
    </figure>
  );
}

export function ZoomImg({ photo, sizes, className, eager }: { photo: Photo; sizes: string; className?: string; eager?: boolean }) {
  return (
    <img
      {...web(photo.src, sizes)}
      alt={photo.alt}
      className={className}
      data-zoom=""
      data-caption={photo.label}
      tabIndex={0}
      role="button"
      aria-label={`${photo.alt}. Open larger image`}
      loading={eager ? undefined : 'lazy'}
      decoding="async"
    />
  );
}

export function SiteNav({ overlay, current }: { overlay?: boolean; current?: string }) {
  return (
    <nav className={overlay ? 'nav shell' : 'nav nav-solid shell'} aria-label="Main navigation">
      <a href="/" className="brand">Friends of <span>Phatthalung</span></a>
      <div className="nav-links">
        {pageLinks.map(link => (
          <a key={link.href} href={link.href} aria-current={current === link.href ? 'page' : undefined}>{link.label}</a>
        ))}
      </div>
      <a className="nav-cta" href={overlay ? '#visit' : '/#visit'}>Come visit <span aria-hidden="true">→</span></a>
    </nav>
  );
}

/** Cards that lead to the gallery pages, each with a cover photo and a count. */
export function ExploreCards({ exclude }: { exclude?: string }) {
  return (
    <div className="explore-cards">
      {galleries.filter(gallery => gallery.slug !== exclude).map(gallery => (
        <a key={gallery.slug} className="explore-card" href={gallery.href}>
          <img {...web(gallery.cover.src, '(max-width: 760px) 100vw, 34vw')} alt="" loading="lazy" decoding="async" />
          <span className="explore-card-text">
            <small>{photoCount(gallery)} photos</small>
            <strong>{gallery.title} <em>{gallery.titleEm}</em></strong>
            <i aria-hidden="true">→</i>
          </span>
        </a>
      ))}
      {exclude !== 'play' && (
        <a className="explore-card is-game" href="/play">
          <img src="/game/route-0.jpg" alt="" loading="lazy" decoding="async" />
          <span className="explore-card-text">
            <small>3 levels · phone friendly</small>
            <strong>Buffalo Boy <em>adventure</em></strong>
            <i aria-hidden="true">→</i>
          </span>
        </a>
      )}
    </div>
  );
}

export function VisitSection() {
  return (
    <section id="visit" className="visit-section">
      <div className="shell visit-grid">
        <figure className="visit-photo">
          <ZoomImg photo={{ src: '/photos/come-visit-congregation.jpg', alt: 'Friends of the Phatthalung congregation gathered outside their Kingdom Hall', label: 'There is always room for one more.' }} sizes="(max-width: 760px) 100vw, 50vw" />
          <figcaption>There is always room for one more.</figcaption>
        </figure>
        <div className="visit-copy">
          <p className="kicker">COME AND VISIT</p>
          <h2>Come and meet<br /><em>our congregation.</em></h2>
          <p>You would be warmly welcomed at one of our meetings in Phatthalung. To find the current meeting location, schedule, and contact information, use the <strong>Find a Meeting</strong> feature on JW.ORG.</p>
          <p className="visit-contact-note">Planning a visit or have a question? Get in touch with us.</p>
          <VisitButtons />
        </div>
      </div>
    </section>
  );
}

export function VisitButtons() {
  return (
    <div className="visit-actions">
      <a className="visit-button" href="https://www.jw.org/en/jehovahs-witnesses/meetings/" target="_blank" rel="noreferrer">Find a meeting on JW.ORG <span aria-hidden="true">↗</span></a>
      <a className="visit-button" href="mailto:visit@friendsofphatthalung.com">Contact us about visiting <svg className="mail-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.75 5.75h16.5v12.5H3.75z" /><path d="m4.5 7 7.5 6 7.5-6" /></svg></a>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer shell">
      <a href="/" className="brand">Friends of <span>Phatthalung</span></a>
      <p>A warm collection of congregation life in Phatthalung, Thailand.</p>
      <a href="#top">Back to top ↑</a>
    </footer>
  );
}
