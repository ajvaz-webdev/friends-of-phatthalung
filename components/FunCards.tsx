'use client';
// The three playful extras, side by side: the starter pack, the plan picker
// and a launch card for the Buffalo Boy game (which now has its own page).
import { useEffect, useRef, useState } from 'react';
import { adventures, starterItems } from '../app/photos';

export default function FunCards() {
  const [count, setCount] = useState(0);
  const [adventure, setAdventure] = useState(0);
  const [rolling, setRolling] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const choose = () => {
    if (rolling) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAdventure(current => (current + 1 + Math.floor(Math.random() * (adventures.length - 1))) % adventures.length);
      return;
    }
    setRolling(true);
    let turns = 0;
    const stop = 8 + Math.floor(Math.random() * adventures.length);
    timer.current = setInterval(() => {
      setAdventure(current => (current + 1) % adventures.length);
      turns += 1;
      if (turns >= stop) { if (timer.current) clearInterval(timer.current); timer.current = null; setRolling(false); }
    }, 95);
  };

  const full = count >= starterItems.length;
  return (
    <section id="fun" className="fun-section" aria-labelledby="fun-title">
      <div className="shell">
        <header className="fun-heading">
          <p className="surprise-label">A LITTLE PHATTHALUNG FUN</p>
          <h2 id="fun-title">Tap, roll, <em>and play.</em></h2>
        </header>
        <div className="fun-grid">
          <article className="fun-card starter-mini">
            <p className="fun-overline">THE STARTER PACK</p>
            <h3>What we carry everywhere</h3>
            <ul aria-live="polite">
              {starterItems.map((item, index) => (
                <li key={item.name} className={index < count ? 'is-packed' : ''}>
                  <span aria-hidden="true">{item.icon}</span>
                  {index < count ? <span><strong>{item.name}</strong><small>{item.note}</small></span> : <span className="starter-hidden">Item {index + 1}</span>}
                </li>
              ))}
            </ul>
            <button onClick={() => setCount(full ? 0 : count + 1)}>{count === 0 ? 'Open the pack' : full ? 'Reset the pack' : 'Pack one more'} <span aria-hidden="true">{full ? '↺' : '+'}</span></button>
          </article>
          <article className="fun-card plan-mini">
            <p className="fun-overline">TODAY’S PLAN</p>
            <h3>Let Phatthalung choose</h3>
            <div className={rolling ? 'adventure-result is-rolling' : 'adventure-result'} aria-live="polite" aria-atomic="true">
              <strong>{adventures[adventure].title}</strong>
              <span>{adventures[adventure].note}</span>
            </div>
            <button onClick={choose} disabled={rolling}>{rolling ? 'Choosing…' : 'Choose our adventure'} <span aria-hidden="true">→</span></button>
          </article>
          <a className="fun-card game-mini" href="/play">
            <img src="/game/route-0.jpg" alt="" loading="lazy" decoding="async" />
            <span className="game-mini-copy">
              <span className="fun-overline">PLAYABLE DETOUR</span>
              <strong>Buffalo Boy</strong>
              <small>Three little journeys through rice fields, Thale Noi’s wetlands, and the town market. Collect mangoes along the way.</small>
              <span className="game-mini-go">Play now <span aria-hidden="true">→</span></span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
