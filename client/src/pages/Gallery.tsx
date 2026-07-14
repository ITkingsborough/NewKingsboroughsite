import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

interface Album {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: GalleryImage[];
}

// ─── Album data ─────────────────────────────────────────────────────────────────

const albums: Album[] = [
  {
    id: 'ordination',
    name: 'Kingsborough Ordination',
    description: 'A sacred milestone — celebrating the ordination of our leaders as they step into their calling.',
    coverImage: '/uploads/gallery/Kingsborough Ordination/02_K3A0384.jpg',
    images: [
      { id: 101, src: '/uploads/gallery/Kingsborough Ordination/02_K3A0384.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 102, src: '/uploads/gallery/Kingsborough Ordination/03_K3A0462.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 103, src: '/uploads/gallery/Kingsborough Ordination/04_K3A9888.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 104, src: '/uploads/gallery/Kingsborough Ordination/05_K3A9926.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 105, src: '/uploads/gallery/Kingsborough Ordination/06_K3A0343.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 106, src: '/uploads/gallery/Kingsborough Ordination/07_K3A0241.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 107, src: '/uploads/gallery/Kingsborough Ordination/08_K3A0265.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 108, src: '/uploads/gallery/Kingsborough Ordination/09_K3A0363.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 109, src: '/uploads/gallery/Kingsborough Ordination/10_K3A0167.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 110, src: '/uploads/gallery/Kingsborough Ordination/11_K3A0194.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 111, src: '/uploads/gallery/Kingsborough Ordination/12_K3A0232.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 112, src: '/uploads/gallery/Kingsborough Ordination/13_K3A0056.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 113, src: '/uploads/gallery/Kingsborough Ordination/14_K3A0090.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 114, src: '/uploads/gallery/Kingsborough Ordination/15_K3A0111.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 115, src: '/uploads/gallery/Kingsborough Ordination/16_K3A0115.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 116, src: '/uploads/gallery/Kingsborough Ordination/17_K3A0126.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 117, src: '/uploads/gallery/Kingsborough Ordination/18_K3A0034.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 118, src: '/uploads/gallery/Kingsborough Ordination/19_K3A0048.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 119, src: '/uploads/gallery/Kingsborough Ordination/20_K3A0056_alt.jpg',alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 120, src: '/uploads/gallery/Kingsborough Ordination/21_K3A0066.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 121, src: '/uploads/gallery/Kingsborough Ordination/22_K3A0070.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 122, src: '/uploads/gallery/Kingsborough Ordination/23_K3A0015.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 123, src: '/uploads/gallery/Kingsborough Ordination/24_K3A0017.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 124, src: '/uploads/gallery/Kingsborough Ordination/25_K3A0001.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 125, src: '/uploads/gallery/Kingsborough Ordination/26_K3A0008.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
      { id: 126, src: '/uploads/gallery/Kingsborough Ordination/27_K3A0011.jpg',    alt: 'Kingsborough Ordination', caption: 'Ordination Ceremony' },
    ],
  },
  {
    id: 'church-life',
    name: 'Church Life',
    description: 'Moments of worship, community, and fellowship that make Kingsborough home.',
    coverImage: '/uploads/gallery/HOP.jpg',
    images: [
      { id: 1,  src: '/uploads/gallery/HOP.jpg',                                         alt: 'Sunday worship service',            caption: 'Sunday morning worship service' },
      { id: 2,  src: '/uploads/gallery/HOP2.JPG',                                        alt: 'Church celebration',                caption: 'Celebrating new beginnings together' },
      { id: 3,  src: '/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.23.jpeg',     alt: 'Hadassah women ministry meeting',   caption: "Hadassah women's ministry meeting" },
      { id: 4,  src: '/uploads/gallery/IMG_7832.JPG',                                    alt: 'Youth group activity',              caption: 'Youth group fellowship and learning' },
      { id: 5,  src: '/uploads/gallery/IMG_7839 (1).jpg',                                alt: 'Youth group fellowship',            caption: 'Youth group fellowship' },
      { id: 6,  src: '/uploads/gallery/IMG_1177.JPG',                                    alt: 'Kingsmen ministry event',           caption: "Kingsmen men's gathering" },
      { id: 7,  src: '/uploads/gallery/16a79bb9-e14d-4375-9610-73efa97e6223.jpg',        alt: 'Kingsmen prayer meeting',           caption: 'Kingsmen prayer breakfast' },
      { id: 8,  src: '/uploads/gallery/2b96f7e5-3a83-42bb-bf84-c08bf9d69203.jpg',        alt: 'Kingsmen ministry meeting',         caption: 'Kingsmen leadership development' },
      { id: 9,  src: '/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.26.jpeg',     alt: "Hadassah women's conference",       caption: "Annual Hadassah women's conference" },
      { id: 10, src: '/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.27.jpeg',     alt: 'Hadassah outreach program',         caption: 'Hadassah gift box outreach preparation' },
      { id: 11, src: '/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.28.jpeg',     alt: 'Youth praise dance performance',    caption: 'Women of God' },
    ],
  },
];

const PREVIEW_COUNT = 8;

// ─── Component ──────────────────────────────────────────────────────────────────

const Gallery = () => {
  const [expandedAlbums, setExpandedAlbums] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<{ albumId: string; imageId: number } | null>(null);

  const toggleAlbum = (albumId: string) => {
    setExpandedAlbums(prev => ({ ...prev, [albumId]: !prev[albumId] }));
  };

  const openLightbox = (albumId: string, imageId: number) => {
    setLightbox({ albumId, imageId });
  };

  const closeLightbox = () => setLightbox(null);

  const currentAlbum = lightbox ? albums.find(a => a.id === lightbox.albumId) : null;
  const currentImages = currentAlbum?.images ?? [];
  const currentIndex = lightbox ? currentImages.findIndex(img => img.id === lightbox.imageId) : -1;

  const goPrev = () => {
    if (currentIndex <= 0) return;
    setLightbox(prev => prev && { ...prev, imageId: currentImages[currentIndex - 1].id });
  };

  const goNext = () => {
    if (currentIndex >= currentImages.length - 1) return;
    setLightbox(prev => prev && { ...prev, imageId: currentImages[currentIndex + 1].id });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, currentIndex]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  return (
    <>
      <Helmet>
        <title>Photo Gallery | Kingsborough Church</title>
        <meta name="description" content="Browse our gallery of church events, worship services, and community outreach." />
      </Helmet>

      {/* Hero */}
      <div className="pt-28 pb-14 bg-deepPurple">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-white mb-4"
          >
            Moments Captured
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            Experience the joy, worship, and community through our lens
          </motion.p>
        </div>
      </div>

      {/* Album index pills */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 py-3">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {albums.map(album => (
              <a
                key={album.id}
                href={`#album-${album.id}`}
                className="px-4 py-1.5 rounded-full text-sm font-montserrat font-medium border border-deepPurple/20 text-deepPurple hover:bg-deepPurple hover:text-white transition-colors"
              >
                {album.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Albums */}
      <div className="bg-slate-50 pb-20">
        {albums.map((album, albumIdx) => {
          const isExpanded = expandedAlbums[album.id] ?? false;
          const visibleImages = isExpanded ? album.images : album.images.slice(0, PREVIEW_COUNT);
          const hasMore = album.images.length > PREVIEW_COUNT;

          return (
            <section key={album.id} id={`album-${album.id}`} className="py-14 border-b border-gray-200 last:border-0">
              <div className="container mx-auto px-4 lg:px-8">
                {/* Album header */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-montserrat font-semibold text-gold uppercase tracking-widest">
                        Album {String(albumIdx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-deepPurple">
                      {album.name}
                    </h2>
                    <p className="mt-1 text-gray-500 max-w-xl">{album.description}</p>
                  </div>
                  <span className="text-sm text-gray-400 font-montserrat shrink-0">
                    {album.images.length} photos
                  </span>
                </motion.div>

                {/* Image grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {visibleImages.map((image, idx) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.97 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
                      className="relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer group shadow-sm"
                      onClick={() => openLightbox(album.id, image.id)}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-deepPurple/0 group-hover:bg-deepPurple/40 transition-colors duration-300 flex items-end">
                        <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                          <p className="text-white text-xs font-medium">{image.caption}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Show more / less */}
                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => toggleAlbum(album.id)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-deepPurple text-deepPurple font-montserrat font-semibold text-sm hover:bg-deepPurple hover:text-white transition-colors"
                    >
                      {isExpanded ? (
                        <><ChevronUp className="w-4 h-4" /> Show Less</>
                      ) : (
                        <><ChevronDown className="w-4 h-4" /> View All {album.images.length} Photos</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Lightbox — rendered in a portal so parent transforms don't affect fixed positioning */}
      {createPortal(
        <AnimatePresence>
          {lightbox && currentIndex !== -1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
              className="bg-black/95 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-5xl flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                {/* Close */}
                <button
                  onClick={closeLightbox}
                  className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-7 h-7" />
                </button>

                {/* Image */}
                <div className="relative rounded-xl overflow-hidden bg-black/40 max-h-[80vh] flex items-center justify-center">
                  <img
                    src={currentImages[currentIndex].src}
                    alt={currentImages[currentIndex].alt}
                    className="max-h-[80vh] w-auto max-w-full object-contain"
                  />

                  {/* Prev */}
                  {currentIndex > 0 && (
                    <button
                      onClick={goPrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}

                  {/* Next */}
                  {currentIndex < currentImages.length - 1 && (
                    <button
                      onClick={goNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>

                {/* Caption bar */}
                <div className="mt-3 flex items-center justify-between text-white/80 text-sm px-1">
                  <span>{currentImages[currentIndex].caption}</span>
                  <span className="text-white/50">{currentIndex + 1} / {currentImages.length}</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Gallery;
