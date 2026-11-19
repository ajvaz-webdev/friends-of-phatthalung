// The frame around every gallery page: nav, gallery, "keep exploring", a
// short visit invitation and the footer.
import GalleryView from './GalleryView';
import PageTools from './PageTools';
import ZoomMain from './ZoomMain';
import { ExploreCards, SiteFooter, SiteNav, VisitButtons, pageLinks } from './site';

export const galleryTools = [
  { href: '/', label: 'Home' },
  ...pageLinks,
  { href: '/#visit', label: 'Come and visit' },
];

export default function GalleryPage({ slug }: { slug: string }) {
  return (
    <ZoomMain>
      <SiteNav current={`/${slug}`} />
      <GalleryView slug={slug} />
      <KeepExploring exclude={slug} />
      <PageTools links={galleryTools} visitHref="/#visit" />
    </ZoomMain>
  );
}

export function KeepExploring({ exclude }: { exclude: string }) {
  return (
    <>
      <section className="keep-exploring">
        <div className="shell">
          <p className="kicker">KEEP EXPLORING</p>
          <ExploreCards exclude={exclude} />
        </div>
      </section>
      <section className="visit-band">
        <div className="shell visit-band-inner">
          <div>
            <p className="kicker">COME AND VISIT</p>
            <h2>There is always <em>room for one more.</em></h2>
          </div>
          <VisitButtons />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
