import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { slideUp } from '@/lib/animations';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string | null;
  featured: boolean;
}

function formatEventDateTime(event: Event): string {
  try {
    const date = new Date(event.date);
    const datePart = date
      .toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
      .toUpperCase();
    return `${datePart} \u00B7 ${event.time.toUpperCase()}`;
  } catch {
    return event.time.toUpperCase();
  }
}

// TEMPORARY placeholder events — remove once real upcoming events exist in the database
const PLACEHOLDER_EVENTS: Event[] = [
  {
    id: -1,
    title: 'Hike and Fellowship',
    description: "We're gathering for a relaxed day of walking, conversation, and fellowship in the Chiltern Hills. This is a great opportunity to connect with one another outside of the regular Sunday service and enjoy time together in God's creation. More details will be shared soon.",
    date: '2026-09-05',
    time: '10:00 AM',
    location: 'Chiltern Hills',
    image: '/uploads/gallery/HOP.jpg',
    featured: true,
  },
  {
    id: -2,
    title: 'Sisters Circle: Testimonies Part 2',
    description: 'Women of the church are invited to gather for Sisters Circle following Sunday service. This session continues our testimonies theme with Part 2, creating space to share what God has done and be strengthened in faith together.',
    date: '2026-09-13',
    time: 'After Service',
    location: 'Main Sanctuary',
    image: '/uploads/gallery/HOP2.JPG',
    featured: false,
  },
  {
    id: -3,
    title: 'Revival With Pastor Jamil',
    description: 'Set aside this weekend for a focused time of revival ministry with Pastor Jamil. Friday and Saturday evening services at 7pm. Further information for Sunday will be shared with the church.',
    date: '2026-09-25',
    time: '7:00 PM',
    location: 'Main Sanctuary',
    image: '/uploads/gallery/prayer22.jpg',
    featured: false,
  },
];

const Events = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const { data: eventsData, isLoading } = useQuery<{ success: boolean; data: Event[] }>({
    queryKey: ['/api/events/upcoming'],
  });

  const events = eventsData && eventsData.data.length > 0 ? eventsData.data : PLACEHOLDER_EVENTS;
  const activeEvent = events[index];

  const goPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const goNext = () => {
    setDirection(1);
    setIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <section id="events" data-nav-theme="light" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-gold" />
        </div>
      </section>
    );
  }

  return (
    <section id="events" data-nav-theme="light" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <span className="inline-flex items-center px-4 py-2 mb-4 rounded-full border border-gold/40 text-gold text-xs font-montserrat font-semibold tracking-[0.2em] uppercase">
            What's Happening
          </span>
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-deepPurple">
            Upcoming Events
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={activeEvent.id}
              custom={direction}
              initial={(d: number) => ({ opacity: 0, x: d * 60 })}
              animate={{ opacity: 1, x: 0 }}
              exit={(d: number) => ({ opacity: 0, x: d * -60 })}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center"
            >
              {/* Poster image */}
              <Link
                href="/events"
                className="block aspect-square w-full max-w-md mx-auto md:mx-0 rounded-lg overflow-hidden shadow-lg bg-gray-100"
              >
                <img
                  src={activeEvent.image || '/uploads/gallery/HOP2.JPG'}
                  alt={activeEvent.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>

              {/* Content */}
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-4xl font-montserrat font-extrabold uppercase text-deepPurple mb-2 leading-tight">
                  {activeEvent.title}
                </h3>
                <p className="text-gold font-montserrat font-bold uppercase tracking-wide mb-5">
                  {formatEventDateTime(activeEvent)}
                </p>
                <p className="text-gray-600 leading-relaxed mb-6 max-w-md mx-auto md:mx-0">
                  {activeEvent.description}
                </p>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center bg-gold text-deepPurple font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-gold/90 transition-colors"
                >
                  {activeEvent.location}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider controls */}
          {events.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={goPrev}
                aria-label="Previous event"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gold hover:text-gold transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {events.map((event, i) => (
                  <button
                    key={event.id}
                    onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                    aria-label={`Go to event ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? 'w-6 bg-gold' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                aria-label="Next event"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gold hover:text-gold transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <motion.div
          className="text-center mt-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={slideUp(0.2)}
        >
          <Link href="/events" className="inline-block border-2 border-gold text-gold px-8 py-3 rounded-full hover:bg-gold hover:text-white transition-colors font-montserrat font-medium">
            View All Events
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;

