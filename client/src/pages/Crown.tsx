import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Crown as CrownIcon,
  Users,
  Heart,
  BookOpen,
  Music,
  Sparkles,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const slideUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" },
  },
});

const Crown = () => {
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
          backgroundImage: `url('/uploads/gallery/IMG_7839%20(1).jpg')`,
          backgroundPosition: "50% 50%",
        }}
      >
        
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={slideUp()}
            className="text-5xl md:text-7xl font-montserrat font-bold mb-6"
          >
            Centre Point
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={slideUp(0.2)}
            className="text-xl md:text-2xl font-light leading-relaxed"
          >
            Young adults pursuing purpose, passion, and the presence of God
          </motion.p>
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
                About Centre Point
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Centre Point is a vibrant young adults ministry at Kingsborough
                Church, designed for individuals ages 18-35 who are passionate
                about growing in their faith and making a difference in the
                world. We believe that young adulthood is a crucial season of
                discovering identity, purpose, and calling in Christ.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our community is a safe space where young adults can ask hard
                questions, build authentic friendships, and experience God's
                presence in powerful ways. We're not about religious
                routine—we're about real relationships with Jesus and each other
                that transform lives and impact our generation.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.2)}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Young adults in worship"
                className="rounded-lg shadow-xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-lightLilac">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-deepPurple">
              What We Do
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our ministry focuses on creating meaningful experiences that help
              young adults grow spiritually and connect deeply
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">
                Worship Nights
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Monthly worship gatherings featuring passionate praise, powerful
                prayer, and encountering God's presence in a relaxed and
                contemporary atmosphere.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.1)}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">
                Life Groups
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Small groups meeting throughout the week for Bible study,
                discussion, and accountability in a comfortable setting where
                everyone can share and grow.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.2)}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">
                Service & Outreach
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Community service projects, mission trips, and outreach
                initiatives that put faith into action and make a tangible
                difference in people's lives.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.3)}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">
                Social Events
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Fun gatherings, game nights, movie screenings, and social
                activities that help build friendships and create a welcoming
                community atmosphere.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.4)}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CrownIcon className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">
                Leadership Development
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Training programs and mentorship opportunities that equip young
                adults to discover and develop their gifts for ministry and
                marketplace leadership.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.5)}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">
                Annual Conferences
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yearly conferences and weekend retreats featuring inspiring
                speakers, dynamic worship, and opportunities for spiritual
                breakthrough and renewal.
              </p>
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-deepPurple">
              Centre Point Community
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              See our young adults ministry in action through worship,
              fellowship, and life-changing moments
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Crown Worship Night"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Worship Night</h3>
                  <p className="text-sm opacity-90">
                    Experiencing God's presence together
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.1)}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Crown Life Group"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Life Group</h3>
                  <p className="text-sm opacity-90">
                    Building authentic friendships
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.2)}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Crown Community Service"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Community Service</h3>
                  <p className="text-sm opacity-90">
                    Making a difference together
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.3)}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Crown Social Event"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Social Gathering</h3>
                  <p className="text-sm opacity-90">Fun and fellowship</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.4)}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Crown Leadership Training"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Leadership Training</h3>
                  <p className="text-sm opacity-90">
                    Developing future leaders
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.5)}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Crown Annual Conference"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Annual Conference</h3>
                  <p className="text-sm opacity-90">
                    Spiritual renewal and growth
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp(0.6)}
            className="text-center mt-12"
          >
            <p className="text-lg text-gray-600 mb-6">
              Want to see more of our community in action? Visit our main
              gallery page.
            </p>
            <a href="/gallery" className="btn-outline">
              View Full Gallery
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-lightLilac">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-8 text-deepPurple">
                Join Centre Point
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Whether you're new to faith or have been walking with Jesus for
                years, Centre Point welcomes you to join our community. Come and
                experience a young adults ministry where you can belong, grow,
                and make a real impact.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mr-4">
                    <Music className="w-6 h-6 text-deepPurple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat font-semibold text-deepPurple mb-2">
                      Monthly Worship Night
                    </h3>
                    <p className="text-gray-600">
                      Last Friday of every month at 7:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-deepPurple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat font-semibold text-deepPurple mb-2">
                      Weekly Life Groups
                    </h3>
                    <p className="text-gray-600">
                      Various times and locations throughout the week
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mr-4">
                    <BookOpen className="w-6 h-6 text-deepPurple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat font-semibold text-deepPurple mb-2">
                      Location
                    </h3>
                    <p className="text-gray-600">
                      Kingsborough Church
                      <br />
                      215 High Street, Yiewsley
                      <br />
                      West Drayton, UB7 7QP
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a href="/contact" className="btn-primary">
                  Get Connected
                </a>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.2)}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Young adults in worship and prayer"
                className="rounded-lg shadow-xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-deepPurple text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
          >
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
              Ready to Wear Centre Point?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Take the next step in your spiritual journey. Connect with Centre
              Point and discover a community where you can grow in faith, build
              lasting friendships, and live with purpose.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-secondary">
                Contact Us
              </a>
              <a href="/about" className="btn-outline-white">
                Learn More About Our Church
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Crown;
