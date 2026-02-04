import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building2,
  Users,
  Wifi,
  Car,
  Music,
  Utensils,
  Calendar,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const slideUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" },
  },
});

const fadeIn = (delay: number = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, delay },
  },
});

const venueImages = [
  "/uploads/gallery/IMG_1177.JPG",
  "/uploads/gallery/IMG_7839 (1).jpg",
  "/uploads/gallery/16a79bb9-e14d-4375-9610-73efa97e6223.jpg",
  "/uploads/gallery/2b96f7e5-3a83-42bb-bf84-c08bf9d69203.jpg",
];

const facilities = [
  {
    icon: Users,
    title: "Capacity",
    description: "Accommodates up to 200 guests comfortably",
  },
  {
    icon: Wifi,
    title: "Free WiFi",
    description: "High-speed internet throughout the venue",
  },
  {
    icon: Car,
    title: "Parking",
    description: "Ample on-site parking available",
  },
  {
    icon: Music,
    title: "Sound System",
    description: "Professional audio-visual equipment",
  },
  {
    icon: Utensils,
    title: "Kitchen",
    description: "Fully equipped catering kitchen",
  },
  {
    icon: Building2,
    title: "Flexible Space",
    description: "Adaptable layout for various events",
  },
];

const suitableFor = [
  "Weddings & Receptions",
  "Corporate Events & Meetings",
  "Birthday Parties",
  "Baby Showers",
  "Conferences & Seminars",
  "Community Gatherings",
  "Memorial Services",
  "Graduation Celebrations",
];

const VenueHire = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    gsap.to(heroRef.current, {
      backgroundPosition: "50% 100%",
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <div className="min-h-screen">
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('/uploads/gallery/IMG_1177.JPG')`,
          backgroundPosition: "50% 50%",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white px-4 max-w-4xl mx-auto z-10">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={slideUp()}
            className="text-5xl md:text-7xl font-montserrat font-bold mb-6"
          >
            Venue Hire
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={slideUp(0.2)}
            className="text-xl md:text-2xl font-light leading-relaxed mb-8"
          >
            A beautiful, versatile space for your special occasions
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp(0.4)}
          >
            <a
              href="https://www.venuescanner.com/gb/locations/uxbridge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gold hover:bg-gold/90 text-white font-montserrat font-semibold px-8 py-6 text-lg rounded-full">
                Book Now
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-8 text-deepPurple">
                Your Perfect Event Space
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Located in the heart of West Drayton, Kingsborough Church offers
                a stunning venue space perfect for weddings, corporate events,
                celebrations, and community gatherings. Our versatile hall can be
                transformed to suit your vision.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                With modern facilities, ample parking, and a welcoming
                atmosphere, our venue provides everything you need to make your
                event truly memorable. Our dedicated team is here to help you
                every step of the way.
              </p>
              <div className="flex items-center gap-4 text-gray-600">
                <Building2 className="h-5 w-5 text-deepPurple" />
                <span className="font-montserrat">
                  215 High Street, Yiewsley, West Drayton, UB7 7QP
                </span>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn(0.2)}
              className="grid grid-cols-2 gap-4"
            >
              {venueImages.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-2xl ${
                    index === 0 ? "col-span-2 h-64" : "h-48"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Venue space ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-deepPurple to-purple-900">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-white">
              Facilities & Amenities
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Everything you need for a successful event
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <motion.div
                key={facility.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(index * 0.1)}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-colors"
              >
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <facility.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-white mb-3">
                  {facility.title}
                </h3>
                <p className="text-gray-200">{facility.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-8 text-deepPurple">
                Suitable For
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our versatile venue space can be configured to accommodate a wide
                range of events, from intimate gatherings to larger celebrations.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {suitableFor.map((event, index) => (
                  <motion.div
                    key={event}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeIn(index * 0.05)}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-gold flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{event}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn(0.2)}
              className="relative"
            >
              <img
                src="/uploads/gallery/IMG_7839 (1).jpg"
                alt="Event space"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-gold text-white p-6 rounded-2xl shadow-lg">
                <Calendar className="h-8 w-8 mb-2" />
                <p className="font-montserrat font-bold text-lg">
                  Book Your Date
                </p>
                <p className="text-sm opacity-90">Check availability online</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-deepPurple">
              Ready to Book?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Visit our booking partner to check availability, view pricing, and
              secure your date. Our venue is in high demand, so we recommend
              booking early to avoid disappointment.
            </p>
            <a
              href="https://www.venuescanner.com/gb/locations/uxbridge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-deepPurple hover:bg-deepPurple/90 text-white font-montserrat font-semibold px-10 py-6 text-lg rounded-full">
                Check Availability & Book
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <p className="mt-6 text-gray-500 text-sm">
              You will be redirected to VenueScanner to complete your booking
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VenueHire;
