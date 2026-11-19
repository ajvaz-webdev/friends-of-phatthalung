'use client';
// Round "story" bubbles under the opening photo. Tapping one plays a short,
// full-screen run of photos (tap right/left to move, swipe down to close),
// ending with a button to the full gallery.
import { useCallback, useEffect, useRef, useState } from 'react';
import { stories, web } from '../app/photos';

const SLIDE_MS = 4500;

export default function StoryBubbles() {
  const [story, setStory] = useState(-1);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touch = useRef<{ x: number; y: number; t: number } | null>(null);
  const current = story >= 0 ? stories[story] : null;
  const last = current ? slide === current.slides.length - 1 : false;

  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);

  const close = useCallback(() => { setStory(-1); setSlide(0); setPaused(false); }, []);
  const next = useCallback(() => {
    if (!current) return;
    if (slide < current.slides.length - 1) { setSlide(slide + 1); return; }
    if (story < stories.length - 1) { setStory(story + 1); setSlide(0); return; }
    close();
  }, [current, slide, story, close]);
  const prev = useCallback(() => {
    if (slide > 0) { setSlide(slide - 1); return; }
    if (story > 0) { setStory(story - 1); setSlide(stories[story - 1].slides.length - 1); }
  }, [slide, story]);

  // Move on by itself, but wait on the last photo so the button can be tapped.
  useEffect(() => {
    if (!current || paused || reduced || last) return;
    const timer = setTimeout(next, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [current, slide, paused, reduced, last, next]);

  useEffect(() => {
    if (!current) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [current, next, prev, close]);

  const photo = current?.slides[slide];
  const upcoming = current?.slides[slide + 1];

  return (
    <>
      <div className="story-bubbles" role="list" aria-label="Quick photo stories">
        {stories.map((item, index) => (
          <button key={item.id} role="listitem" className="story-bubble" onClick={() => { setStory(index); setSlide(0); }}>
            <span className="story-ring"><img {...web(item.cover.src, '84px')} alt="" loading="lazy" decoding="async" /></span>
            <span className="story-bubble-label">{item.label}</span>
          </button>
        ))}
        <a role="listitem" className="story-bubble" href="/play">
          <span className="story-ring is-game"><img src="/game/route-0.jpg" alt="" loading="lazy" decoding="async" /></span>
          <span className="story-bubble-label">Play</span>
        </a>
      </div>

      {current && photo && (
        <div
          className="story-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`${current.label} photo story`}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerCancel={() => setPaused(false)}
          onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY, t: Date.now() }; }}
          onTouchEnd={event => {
            if (!touch.current) return;
            const dy = event.changedTouches[0].clientY - touch.current.y;
            const dx = event.changedTouches[0].clientX - touch.current.x;
            touch.current = null;
            if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
          }}
        >
          <img className="story-backdrop" {...web(photo.src, '640px')} alt="" aria-hidden="true" />
          <div className="story-progress" aria-hidden="true">
            {current.slides.map((item, index) => (
              <span key={item.src} className={index < slide ? 'is-done' : index === slide ? 'is-active' : ''}>
                <i style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }} key={`${story}-${slide}`} />
              </span>
            ))}
          </div>
          <div className="story-top">
            <strong>{current.label}</strong>
            <span>{slide + 1} / {current.slides.length}</span>
            <button className="story-close" onClick={close} aria-label="Close story">×</button>
          </div>
          <img key={photo.src} className="story-photo" {...web(photo.src, '100vw')} alt={photo.alt} />
          {upcoming && <img className="story-preload" {...web(upcoming.src, '100vw')} alt="" aria-hidden="true" />}
          <button className="story-tap is-prev" onClick={prev} aria-label="Previous photo" />
          <button className="story-tap is-next" onClick={next} aria-label="Next photo" />
          <div className="story-caption">
            <p>{photo.label}</p>
            {last && (
              <a className="story-cta" href={current.cta.href} onClick={() => { if (current.cta.href.startsWith('#')) close(); }}>
                {current.cta.label} <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
