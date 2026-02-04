import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "wouter";
import { Heart, Crown as CrownIcon, Shield, Baby } from "lucide-react";
import { Helmet } from "react-helmet";

gsap.registerPlugin(ScrollTrigger);

const slideUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, delay, ease: "easeOut" } 
  }
});

interface CommunityGroup {
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  icon: any;
  link?: string;
  hasPage: boolean;
}

const communityGroups: CommunityGroup[] = [
  {
    title: "Hillingdon Foodbank",
    description: "Supporting those in need with essential food and supplies",
    fullDescription: "Our Hillingdon Foodbank is dedicated to fighting hunger and poverty in our local community. We provide emergency food parcels to individuals and families facing crisis, offering not just practical support but also compassion and dignity. Volunteers work together to collect, sort, and distribute food donations, making a real difference in people's lives during their most difficult times.",
    image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: Heart,
    hasPage: false
  },
  {
    title: "CMC Nursery",
    description: "Nurturing childcare and early education in a Christ-centered environment",
    fullDescription: "CMC Nursery provides quality childcare and early years education rooted in Christian values. We create a safe, loving environment where children can learn, play, and develop. Our experienced staff focus on nurturing each child's physical, emotional, social, and spiritual growth through age-appropriate activities, play-based learning, and gentle guidance in faith.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: Baby,
    hasPage: false
  },
  {
    title: "Hadassah",
    description: "Women's ministry empowering ladies through faith and fellowship",
    fullDescription: "Hadassah is our vibrant women's ministry that creates a safe space for women to grow in faith, build authentic friendships, and support one another through all seasons of life. Through Bible studies, prayer meetings, social events, and service projects, we encourage women to discover their identity in Christ and live out their calling with confidence and purpose.",
    image: "/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.23.jpeg",
    icon: Heart,
    link: "/hadassah",
    hasPage: true
  },
  {
    title: "Kingsmen",
    description: "Men's fellowship focusing on faith, leadership and authentic Christian masculinity",
    fullDescription: "Kingsmen is our men's ministry dedicated to building authentic Christian masculinity through fellowship, discipleship, and service. We believe men are called to be leaders, protectors, and servants in their families, communities, and the kingdom of God. Through Bible studies, service projects, adventure activities, and mentorship programs, we help men grow in their faith and fulfill their God-given purpose.",
    image: "/uploads/gallery/image (2).png",
    icon: Shield,
    link: "/kingsmen",
    hasPage: true
  },
  {
    title: "Centre Point",
    description: "Young adults pursuing purpose, passion, and the presence of God",
    fullDescription: "Centre Point is our dynamic young adults ministry for individuals ages 18-35 who are passionate about growing in their faith and making a difference. We create a space where young adults can ask hard questions, build authentic friendships, and experience God's presence through worship nights, life groups, service projects, and social events. Here, you'll find a community that supports you in discovering your identity, purpose, and calling in Christ.",
    image: "/uploads/gallery/IMG_7839 (1).jpg",
    icon: CrownIcon,
    link: "/crown",
    hasPage: true
  }
];

const Community = () => {
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
        scrub: true
      }
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Community | Kingsborough Church</title>
        <meta name="description" content="Discover our vibrant community groups and ministries. Find your place to connect, grow, and serve at Kingsborough Church." />
      </Helmet>
      
      <div className="min-h-screen">
        <section 
          ref={heroRef}
          className="relative h-96 flex items-center justify-center bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            backgroundPosition: "50% 50%"
          }}
        >
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={slideUp()}
              className="text-5xl md:text-6xl font-montserrat font-bold mb-6"
            >
              Our Community
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={slideUp(0.2)}
              className="text-xl md:text-2xl font-light leading-relaxed"
            >
              Find your place to belong, grow, and serve
            </motion.p>
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
                Connect & Grow Together
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                At Kingsborough Church, we believe that life is better together. Our community groups 
                provide meaningful ways to connect with others, grow in faith, and make a difference.
              </p>
            </motion.div>

            <div className="space-y-16">
              {communityGroups.map((group, index) => (
                <motion.div
                  key={group.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={slideUp()}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                      <group.icon className="w-8 h-8 text-deepPurple" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-deepPurple">
                      {group.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-4 font-medium">
                      {group.description}
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {group.fullDescription}
                    </p>
                    {group.hasPage && group.link ? (
                      <Link href={group.link}>
                        <a className="btn-primary inline-block">
                          Learn More
                        </a>
                      </Link>
                    ) : (
                      <Link href="/contact">
                        <a className="btn-outline inline-block">
                          Get Involved
                        </a>
                      </Link>
                    )}
                  </div>
                  
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="relative rounded-lg overflow-hidden shadow-xl group">
                      <img 
                        src={group.image} 
                        alt={group.title} 
                        className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-deepPurple">
                Ready to Get Connected?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                We'd love to help you find the perfect community group for you. Whether you're new 
                to faith or have been walking with Jesus for years, there's a place for you here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <a className="btn-primary">
                    Contact Us
                  </a>
                </Link>
                <Link href="/about">
                  <a className="btn-outline">
                    Learn More About Our Church
                  </a>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Community;
