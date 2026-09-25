import Hero from '@/components/home/Hero';
import Welcome from '@/components/home/Welcome';
import MissionVision from '@/components/home/MissionVision';
import Leadership from '@/components/home/Leadership';
import Community from '@/components/home/Community';
import Organizations from '@/components/home/Organizations';
import Quote from '@/components/home/Quote';
import Events from '@/components/home/Events';
import Sermons from '@/components/home/Sermons';
import LifeCollage from '@/components/home/LifeCollage';
import Contact from '@/components/home/Contact';
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
        <MissionVision />
        <Leadership />
        <Events />
        <Community />
        <Organizations />
        <Quote />
        <Sermons />
        <LifeCollage />
        <Contact />
      </div>
    </>
  );
};

export default Home;
