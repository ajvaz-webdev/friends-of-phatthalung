'use client';
// A full gallery page body: header, filter chips and a masonry grid that
// keeps every photo at its natural shape.
import { useState } from 'react';
import { galleryBySlug } from '../app/photos';
import { Figure, pageLinks } from './site';

export default function GalleryView({ slug }: { slug: string }) {
  const gallery = galleryBySlug(slug);
  const [filter, setFilter] = useState('all');
  const groups = filter === 'all' ? gallery.groups : gallery.groups.filter(group => group.id === filter);
  return (
    <>
      <header id="top" className="gallery-page-head">
        <div className="shell">
          <a className="back-home" href="/">← Home</a>
          <p className="kicker">{gallery.kicker}</p>
          <h1>{gallery.title}<br /><em>{gallery.titleEm}</em></h1>
          <p className="gallery-page-intro">{gallery.intro}</p>
          <nav className="page-switch" aria-label="Galleries">
            {pageLinks.map(link => <a key={link.href} href={link.href} aria-current={link.href === gallery.href ? 'page' : undefined}>{link.label}</a>)}
          </nav>
        </div>
      </header>
      <div className="shell gallery-page-body">
        <div className="chips" role="toolbar" aria-label="Show photos by theme">
          <button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All <span>{gallery.groups.reduce((sum, group) => sum + group.items.length, 0)}</span></button>
          {gallery.groups.map(group => (
            <button key={group.id} aria-pressed={filter === group.id} onClick={() => setFilter(group.id)}>
              {group.label} <span>{group.items.length}</span>
            </button>
          ))}
        </div>
        {groups.map(group => (
          <section key={group.id} className="masonry-group" aria-labelledby={`group-${group.id}`} data-zoom-group="">
            <h2 id={`group-${group.id}`} className="masonry-title">{group.label}</h2>
            <div className="masonry">
              {group.items.map(item => <Figure key={'src' in item ? item.src : item.video} item={item} sizes="(max-width: 760px) 50vw, 33vw" />)}
            </div>
          </section>
        ))}
        {gallery.notes && filter === 'all' && (
          <div className="nature-notes">
            {gallery.notes.map(note => <p key={note.title}><strong>{note.title}</strong><span>{note.text}</span></p>)}
          </div>
        )}
      </div>
    </>
  );
}
