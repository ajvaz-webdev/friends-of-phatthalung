import type { Metadata } from 'next';
import GalleryPage from '../../components/GalleryPage';

export const metadata: Metadata = { title: 'Things to do · Friends of Phatthalung' };

export default function Page() {
  return <GalleryPage slug="things-to-do" />;
}
