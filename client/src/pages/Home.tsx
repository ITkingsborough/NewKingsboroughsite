import Hero from '@/components/home/Hero';
import Welcome from '@/components/home/Welcome';
import About from '@/components/home/About';
import Community from '@/components/home/Community';
import Quote from '@/components/home/Quote';
import FeaturedContent from '@/components/home/FeaturedContent';
import Events from '@/components/home/Events';
import Sermons from '@/components/home/Sermons';
import Magazines from '@/components/home/Magazines';
import Giving from '@/components/home/Giving';
import Contact from '@/components/home/Contact';
import Newsletter from '@/components/home/Newsletter';
import Tributes from '@/components/home/Tributes';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Kingsborough Church - Where Faith Meets Community</title>
        <meta name="description" content="Kingsborough Church is a welcoming community where faith meets life. Join us for inspiring worship, meaningful connections, and opportunities to grow." />
      </Helmet>
      <div>
        <Hero />

        {/* Memorial Notice */}
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-deepPurple text-white py-10 px-4"
        >
          <div className="container mx-auto max-w-4xl text-center">
            <div className="border border-gold/40 rounded-2xl px-8 py-8 relative">
              <div className="w-10 h-0.5 bg-gold mx-auto mb-5"></div>
              <p className="text-gold font-montserrat font-semibold text-sm uppercase tracking-widest mb-3">
                A Message to Our Church Family
              </p>
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold mb-5 leading-snug">
                In Loving Memory of Our Apostle
              </h2>
              <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-5">
                It is with profound sadness and deep sorrow that we share the news of the passing of our beloved Apostle
                on <strong className="text-gold">16th May 2026</strong>. His life was a testament of unwavering faith, sacrificial love, and
                extraordinary grace. He poured himself into this church family and into the lives of countless people around the world.
                His legacy will continue to shape us and the generations that follow.
              </p>
              <p className="text-white/70 text-sm md:text-base italic">
                "I have fought a good fight, I have finished my course, I have kept the faith." — 2 Timothy 4:7
              </p>
              <div className="w-10 h-0.5 bg-gold mx-auto mt-6"></div>
            </div>
          </div>
        </motion.section>

        <Tributes />
        <Welcome />
        <About />
        <Community />
        <Quote />
        <FeaturedContent />
        <Events />
        <Sermons />
        <Magazines />
        <Giving />
        <Contact />
        <Newsletter />
      </div>
    </>
  );
};

export default Home;
