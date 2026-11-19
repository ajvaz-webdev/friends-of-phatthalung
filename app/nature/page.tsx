import type { Metadata } from 'next';
import GalleryPage from '../../components/GalleryPage';

export const metadata: Metadata = { title: 'Nature · Friends of Phatthalung' };

export default function Page() {
  return <GalleryPage slug="nature" />;
}
