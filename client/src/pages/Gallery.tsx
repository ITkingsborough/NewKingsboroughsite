import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useGsapAnimations } from '@/hooks/use-gsap-animations';
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Gallery image data
const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1508963493744-76fce69379c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Sunday worship service with congregation raising hands",
    tags: ["worship", "service"],
    caption: "Sunday morning worship service"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1515091943-9d5c0ad475af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Church baptism ceremony",
    tags: ["baptism", "service"],
    caption: "Celebrating new beginnings through baptism"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1603102859961-64b17d43580c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Community outreach feeding program",
    tags: ["outreach", "community"],
    caption: "Our monthly community feeding program"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1647891941746-fe1d53ddc7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
    alt: "Children enjoying Sunday School activities",
    tags: ["kids", "education"],
    caption: "Sunday School fun and learning"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1541384959902-a2fa99a3daba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Church music team during worship",
    tags: ["worship", "music"],
    caption: "Our worship team leading in praise"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1471565661762-b9dfae862dbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Youth group outdoor activity",
    tags: ["youth", "community"],
    caption: "Youth group summer retreat"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Church anniversary celebration",
    tags: ["events", "community"],
    caption: "Celebrating our 25th church anniversary"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1490349708435-19d432984978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Prayer meeting with people kneeling",
    tags: ["prayer", "worship"],
    caption: "Wednesday night prayer service"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1505455184862-554165e5f6ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Women's conference group photo",
    tags: ["women", "events"],
    caption: "Annual women's conference"
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Church volunteers packing donation boxes",
    tags: ["outreach", "community"],
    caption: "Holiday gift box outreach preparation"
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Youth praise dance performance",
    tags: ["youth", "worship"],
    caption: "Youth praise dance ministry"
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1445273037325-2aa8c163f6eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Church small group meeting in home",
    tags: ["community", "prayer"],
    caption: "Home small group gathering"
  }
];

// Extract unique tags from images - for debugging, add manually if array is empty
let extractedTags = Array.from(new Set(galleryImages.flatMap(img => img.tags)));
// If no tags were extracted, provide some defaults
if (extractedTags.length === 0) {
  extractedTags = ["worship", "service", "baptism", "community", "prayer", "outreach"];
}
const allTags = ["all", ...extractedTags];

// Log to ensure tags are present
console.log("Gallery tags:", allTags);

const Gallery = () => {
  const [activeTag, setActiveTag] = useState("all");
  const [openImage, setOpenImage] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<number[]>([]);
  const [displayCount, setDisplayCount] = useState(8);
  
  // Refs for GSAP animations
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const { createRevealAnimation } = useGsapAnimations();
  
  // Filter images based on active tag
  const filteredImages = activeTag === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.tags.includes(activeTag));
    
  // Get displayed images based on the display count
  const displayedImages = filteredImages.slice(0, displayCount);
  
  // Handle image load
  const handleImageLoad = (id: number) => {
    setLoaded(prev => [...prev, id]);
  };
  
  // Find current image index
  const currentImageIndex = openImage !== null 
    ? filteredImages.findIndex(img => img.id === openImage) 
    : -1;
  
  // Navigate to next image
  const nextImage = () => {
    if (currentImageIndex === -1) return;
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setOpenImage(filteredImages[nextIndex].id);
  };
  
  // Navigate to previous image
  const prevImage = () => {
    if (currentImageIndex === -1) return;
    const prevIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setOpenImage(filteredImages[prevIndex].id);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (openImage === null) return;
      
      if (e.key === 'Escape') {
        setOpenImage(null);
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openImage, filteredImages]);
  
  // Function to load more images
  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 8, filteredImages.length));
  };
  
  // Reset display count when tag changes
  useEffect(() => {
    setDisplayCount(8);
  }, [activeTag]);
  
  // Simplified animations that won't interfere with content visibility
  useEffect(() => {
    if (!headerRef.current) return;
    
    // Simple header animation only - avoid animating critical UI elements
    gsap.from(headerRef.current.children, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power1.out"
    });
    
    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Photo Gallery | Kingsborough Church</title>
        <meta name="description" content="Browse our gallery of church events, worship services, and community outreach. Experience the moments of joy, worship, and community at Kingsborough Church." />
      </Helmet>
      
      {/* Header Section */}
      <div ref={headerRef} className="pt-28 pb-12 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-deepPurple mb-4">
            Moments Captured
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the joy, the worship, the community through our lens
          </p>
        </div>
      </div>
      
      {/* Tag Filter Bar - Fixed version with high visibility */}
      <div className="py-8 bg-deepPurple fixed top-16 left-0 right-0 z-50 shadow-lg" style={{ position: 'sticky', top: 0 }}>
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl text-gold font-bold mb-6 text-center">
            FILTER BY CATEGORY
          </h2>
          <div className="flex flex-wrap justify-center gap-5 py-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={activeTag === tag
                  ? "bg-gold text-white px-6 py-3 rounded-lg text-lg font-bold shadow-lg"
                  : "bg-white text-deepPurple border-2 border-gold px-6 py-3 rounded-lg text-lg font-medium hover:bg-gold hover:text-white"
                }
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Gallery Grid */}
      <section className="py-16 mt-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Simple grid without animations for stability */}
          <div
            ref={galleryRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayedImages.map((image) => (
              <div
                key={image.id}
                className="gallery-item"
              >
                <div 
                  className="relative overflow-hidden rounded-lg shadow-md cursor-pointer aspect-[4/3] group"
                  onClick={() => setOpenImage(image.id)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    onLoad={() => handleImageLoad(image.id)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Bottom tag bar - always visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-deepPurple/60 flex flex-wrap">
                    {image.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="inline-block bg-gold text-white text-xs px-2 py-1 rounded-full mr-2 mb-1"
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </span>
                    ))}
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deepPurple/80 via-deepPurple/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium mt-1">{image.caption}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Show More Button */}
          {filteredImages.length > displayCount && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-gold text-white rounded-lg font-medium transition-all duration-300 hover:bg-deepPurple hover:shadow-lg flex items-center gap-2"
              >
                Show More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Empty state */}
          {filteredImages.length === 0 && (
            <div 
              className="text-center py-16"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-montserrat font-semibold text-gray-600 mb-2">No Images Found</h3>
              <p className="text-gray-500">We couldn't find any images with the selected tag.</p>
              <button 
                onClick={() => setActiveTag('all')}
                className="mt-4 px-4 py-2 bg-gold text-white rounded-lg transition-colors hover:bg-deepPurple"
              >
                View All Images
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {openImage !== null && currentImageIndex !== -1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-deepPurple/95 flex items-center justify-center p-4 md:p-8"
            onClick={() => setOpenImage(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl mx-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={() => setOpenImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gold transition-colors z-10"
                aria-label="Close gallery"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Navigation buttons */}
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-12 bg-white/10 hover:bg-white/30 p-3 rounded-full text-white transition-colors z-10"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-12 bg-white/10 hover:bg-white/30 p-3 rounded-full text-white transition-colors z-10"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Image container */}
              <div className="aspect-[16/10] overflow-hidden rounded-lg bg-black/30">
                <img 
                  src={filteredImages[currentImageIndex].src} 
                  alt={filteredImages[currentImageIndex].alt}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Caption and tags */}
              <div className="mt-4 text-white">
                <div className="flex flex-wrap gap-2 mb-2">
                  {filteredImages[currentImageIndex].tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="inline-block bg-gold text-white text-xs px-2 py-1 rounded-full"
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </span>
                  ))}
                </div>
                <p className="text-lg font-medium">{filteredImages[currentImageIndex].caption}</p>
              </div>
              
              {/* Page indicator */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-8 flex justify-center text-white/70 text-sm">
                {currentImageIndex + 1} / {filteredImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;