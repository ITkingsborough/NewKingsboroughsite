import Hero from '@/components/home/Hero';
import Welcome from '@/components/home/Welcome';
import About from '@/components/home/About';
import Leadership from '@/components/home/Leadership';
import Ministries from '@/components/home/Ministries';
import Community from '@/components/home/Community';
import Quote from '@/components/home/Quote';
import Events from '@/components/home/Events';
import Sermons from '@/components/home/Sermons';
import Giving from '@/components/home/Giving';
import Contact from '@/components/home/Contact';
import Newsletter from '@/components/home/Newsletter';
import { Helmet } from 'react-helmet';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Kingsborough Church - Where Faith Meets Community</title>
        <meta name="description" content="Kingsborough Church is a welcoming community where faith meets life. Join us for inspiring worship, meaningful connections, and opportunities to grow." />
      </Helmet>
      <div>
        <Hero />
        <Welcome />
        <About />
        <Leadership />
        <Ministries />
        <Community />
        <Quote />
        <Events />
        <Sermons />
        <Giving />
        <Contact />
        <Newsletter />
      </div>
    </>
  );
};

export default Home;
