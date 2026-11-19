// Home page: a short front door. The full photo galleries live on their own
// pages (/things-to-do, /nature, /moments) and the game on /play; here each
// gallery gets one swipeable row and a "see all" link.
import FunCards from '../components/FunCards';
import PageTools from '../components/PageTools';
import PhotoRail from '../components/PhotoRail';
import StoryBubbles from '../components/StoryBubbles';
import ZoomMain from '../components/ZoomMain';
import { SiteFooter, SiteNav, VisitSection, ZoomImg } from '../components/site';
import { activityPhotos, alongTheWay, galleryBySlug, lifeHere, littleThings, naturePhotos, onlyHere, pick, sharedMoments, together, web } from './photos';

const thingsPreview = pick(activityPhotos, ['activity-rice-field-riders', 'activity-mural-walk', 'activity-night-market', 'activity-lakeside-cafe', 'activity-train-station', 'activity-mountain-coffee-cart', 'activity-coffee-carnival', 'little-pad-thai-view']);
const naturePreview = [lifeHere[1], ...pick(naturePhotos, ['nature-mountain-walk', 'nature-rock-pool', 'nature-cattle']), lifeHere[0], ...pick(naturePhotos, ['nature-mountain-panorama', 'nature-forest-stream']), onlyHere[1]];
const momentsPreview = [alongTheWay[0], littleThings[8], alongTheWay[1], ...pick(sharedMoments, ['table-feast', 'sunflower-group', 'memory-heart-selfie']), littleThings[1], alongTheWay[6]];

const homeTools = [
  { href: '#together', label: 'Together' },
  { href: '#where', label: 'Where is Phatthalung?' },
  { href: '#preview-things-to-do', label: 'Things to do' },
  { href: '#preview-nature', label: 'Nature' },
  { href: '#preview-moments', label: 'Moments' },
  { href: '#fun', label: 'Starter pack & games' },
  { href: '#visit', label: 'Come and visit' },
  { href: 'galleries', label: 'Full galleries', divider: true },
  { href: '/things-to-do', label: 'Things to do gallery' },
  { href: '/nature', label: 'Nature gallery' },
  { href: '/moments', label: 'Moments gallery' },
  { href: '/play', label: 'Play Buffalo Boy' },
];

export default function Home() {
  return (
    <ZoomMain>
      <SiteNav overlay />
      <section id="top" className="hero">
        <img className="hero-photo" {...web('/photos/main-congregation.jpg', '100vw')} alt="The Phatthalung congregation gathered together for a picnic" fetchPriority="high" data-zoom="" data-caption="Our congregation family" />
        <div className="hero-overlay" />
        <div className="hero-content shell">
          <p className="eyebrow"><span /> PHATTHALUNG, THAILAND</p>
          <h1>A small congregation.<br /><em>One warm family.</em></h1>
          <p>United by our love for Jehovah and for one another, we share the work, the laughter, the meals, and the beauty of life here in Phatthalung.</p>
          <a className="button light" href="#start">Meet us through our moments <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section id="start" className="start-band" aria-label="Start here">
        <div className="shell start-grid">
          <div>
            <p className="start-hint">Tap a circle for a quick photo story</p>
            <StoryBubbles />
          </div>
          <div className="quick-visit">
            <p><strong>Visiting Phatthalung?</strong> You’d be warmly welcomed at our meetings.</p>
            <a href="#visit">How to find us <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      <section id="together" className="together shell">
        <header className="section-heading">
          <div>
            <p className="kicker"><span>01</span> TOGETHER IN THE THINGS THAT MATTER</p>
            <h2>Small in number,<br /><em>rich in friendship.</em></h2>
          </div>
          <p>Our congregation may be small, but no one stands alone. Whether we are sharing in the ministry, helping one another, or pausing for something delicious, there is a quiet joy in doing it together.</p>
        </header>
        <div className="story-grid" data-zoom-group="">
          <figure className="story-main">
            <ZoomImg photo={together[0]} sizes="(max-width: 760px) 100vw, 66vw" />
            <figcaption><strong>One congregation</strong><span>Different ages and backgrounds, united in love for Jehovah and for one another.</span></figcaption>
          </figure>
          <div className="story-note">
            <span className="sun-mark" aria-hidden="true">✦</span>
            <blockquote>“How good and how pleasant it is for brothers to dwell together in unity!”</blockquote>
            <cite>Psalm 133:1</cite>
          </div>
          <figure className="story-side">
            <ZoomImg photo={together[1]} sizes="(max-width: 760px) 100vw, 34vw" />
            <figcaption>{together[1].label}</figcaption>
          </figure>
        </div>
      </section>

      <section id="where" className="where-section">
        <div className="shell where-grid">
          <figure className="map-card">
            <div className="map-frame">
              <img className="map-graphic" src="/phatthalung-map.svg" alt="Focused map of southern Thailand highlighting Phatthalung province" width="1052" height="1850" decoding="async" />
              <span className="map-marker" aria-hidden="true"><i />Phatthalung</span>
            </div>
            <figcaption><span>THAILAND</span><strong>Phatthalung</strong><small>Southern Thailand · west of Songkhla Lake</small></figcaption>
          </figure>
          <div className="where-copy">
            <p className="kicker"><span>02</span> WHERE IS PHATTHALUNG?</p>
            <h2>A quieter corner<br /><em>of southern Thailand.</em></h2>
            <p>Phatthalung lies in Thailand’s far south, beside the western shore of Songkhla Lake and at the foot of the unmistakable Khao Ok Thalu mountain. It is a place of wetlands, rice fields, limestone peaks, village roads, and deeply rooted local traditions.</p>
            <details className="travel-details">
              <summary>Getting here <small>by train, air or road</small><span aria-hidden="true">+</span></summary>
              <div className="travel-grid">
                <div><span aria-hidden="true">✦</span><strong>By train</strong><p>Phatthalung town is served by Thailand’s southern railway, making the journey itself part of the experience.</p></div>
                <div><span aria-hidden="true">✦</span><strong>By air + road</strong><p>Fly to Hat Yai or Trang, then continue by car or local transport into Phatthalung.</p></div>
                <div><span aria-hidden="true">✦</span><strong>By road</strong><p>Highway 41 links the province with the main north–south route through southern Thailand.</p></div>
              </div>
              <a className="map-link" href="https://www.tourismthailand.org/Destinations/Provinces/Phatthalung/349" target="_blank" rel="noreferrer">Explore Phatthalung with Tourism Thailand ↗</a>
            </details>
          </div>
        </div>
        <p className="map-credit shell">Locator map adapted from NordNordWest, Wikimedia Commons (GFDL).</p>
      </section>

      <PhotoRail gallery={galleryBySlug('things-to-do')} photos={thingsPreview} number="03" tone="sand" />
      <PhotoRail gallery={galleryBySlug('nature')} photos={naturePreview} number="04" tone="sage" />
      <PhotoRail gallery={galleryBySlug('moments')} photos={momentsPreview} number="05" tone="forest" />

      <FunCards />

      <section className="closing">
        <img {...web('/photos/group-walk.jpg', '100vw')} alt="Congregation friends walking together through the Phatthalung countryside" loading="lazy" decoding="async" data-zoom="" data-caption="Wherever the road leads" />
        <div className="closing-overlay" />
        <div className="closing-copy">
          <p className="kicker">OUR CONGREGATION FAMILY</p>
          <h2>Wherever the road leads,<br /><em>we walk it together.</em></h2>
          <p>We are grateful for our small, united congregation and for every ordinary day Jehovah gives us to encourage one another.</p>
        </div>
      </section>

      <VisitSection />
      <SiteFooter />
      <PageTools links={homeTools} visitHref="#visit" />
    </ZoomMain>
  );
}
