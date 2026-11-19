import type { Metadata } from 'next';
import BuffaloBoyGame from '../../components/BuffaloBoyGame';
import { KeepExploring, galleryTools } from '../../components/GalleryPage';
import PageTools from '../../components/PageTools';
import { SiteNav } from '../../components/site';

export const metadata: Metadata = { title: 'Buffalo Boy · Friends of Phatthalung' };

export default function Page() {
  return (
    <main>
      <SiteNav current="/play" />
      <div id="top" className="play-top shell"><a className="back-home" href="/">← Home</a></div>
      <BuffaloBoyGame />
      <KeepExploring exclude="play" />
      <PageTools links={galleryTools} visitHref="/#visit" />
    </main>
  );
}
