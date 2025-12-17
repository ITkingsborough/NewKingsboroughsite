import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HandHeart, Clock, Users, BookOpen, Heart, Send } from "lucide-react";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";

gsap.registerPlugin(ScrollTrigger);

const slideUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, delay, ease: "easeOut" } 
  }
});

const PrayerMinistry = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { toast } = useToast();
  const [prayerRequest, setPrayerRequest] = useState({
    name: "",
    email: "",
    request: "",
    isPrivate: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prayerRequest.name,
          email: prayerRequest.email,
          message: prayerRequest.request,
          type: 'prayer_request'
        })
      });

      if (response.ok) {
        toast({
          title: "Prayer Request Submitted",
          description: "Our prayer team will lift your request to the Lord. God bless you!",
        });
        setPrayerRequest({ name: "", email: "", request: "", isPrivate: false });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit prayer request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const prayerTimes = [
    {
      icon: Clock,
      title: "Morning Prayer",
      time: "Tuesday & Thursday, 6:00 AM - 7:00 AM",
      description: "Start your day in God's presence with corporate prayer and intercession."
    },
    {
      icon: Users,
      title: "Prayer Meeting",
      time: "Wednesday, 7:00 PM - 8:30 PM",
      description: "Gather with fellow believers to seek God's face and pray for our church and community."
    },
    {
      icon: BookOpen,
      title: "Prayer & Bible Study",
      time: "Friday, 7:00 PM - 9:00 PM",
      description: "Combine the power of God's Word with fervent prayer in this enriching gathering."
    },
    {
      icon: Heart,
      title: "Prayer Chain",
      time: "24/7 Available",
      description: "Urgent prayer needs are shared with our dedicated prayer chain team around the clock."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Prayer Ministry | Kingsborough Church</title>
        <meta name="description" content="Experience the power of prayer at Kingsborough Church. Join our prayer meetings or submit your prayer requests to our dedicated prayer team." />
      </Helmet>
      
      <div className="min-h-screen">
        <section 
          ref={heroRef}
          className="relative h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(76,0,109,0.7), rgba(76,0,109,0.5)), url('https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            backgroundPosition: "50% 50%"
          }}
        >
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp()}
              className="flex justify-center mb-6"
            >
              <HandHeart className="w-20 h-20 text-gold" />
            </motion.div>
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={slideUp(0.1)}
              className="text-5xl md:text-7xl font-montserrat font-bold mb-6"
            >
              Prayer Ministry
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={slideUp(0.2)}
              className="text-xl md:text-2xl font-light leading-relaxed"
            >
              Connecting heaven and earth through the power of prayer
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
                  The Heart of Our Church
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  Prayer is the foundation of everything we do at Kingsborough Church. We believe that 
                  when God's people gather to pray, heaven moves and lives are transformed. Our Prayer 
                  Ministry exists to cultivate a culture of prayer and intercession.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whether you're facing a difficult season, celebrating a victory, or simply want to 
                  grow deeper in your prayer life, we invite you to join us. Our dedicated prayer team 
                  is committed to standing in the gap and believing God for the impossible.
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
                  src="https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="People praying together" 
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
                Prayer Gatherings
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Multiple opportunities to join in corporate prayer throughout the week
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {prayerTimes.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideUp(index * 0.1)}
                  className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-deepPurple rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-8 h-8 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-bold mb-2 text-deepPurple">
                        {item.title}
                      </h3>
                      <p className="text-gold font-semibold mb-3">{item.time}</p>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
              >
                <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-8 text-deepPurple">
                  Submit a Prayer Request
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  We believe in the power of prayer and consider it a privilege to pray for you. 
                  Share your prayer needs with us, and our dedicated prayer team will lift your 
                  request before the Lord.
                </p>
                <div className="bg-lightLilac p-6 rounded-lg">
                  <h3 className="font-montserrat font-bold text-deepPurple mb-4">
                    "The prayer of a righteous person is powerful and effective."
                  </h3>
                  <p className="text-gray-600 italic">— James 5:16</p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.2)}
              >
                <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg shadow-lg">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block font-montserrat font-semibold text-deepPurple mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={prayerRequest.name}
                        onChange={(e) => setPrayerRequest(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-colors"
                        placeholder="Enter your name"
                        data-testid="input-prayer-name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block font-montserrat font-semibold text-deepPurple mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={prayerRequest.email}
                        onChange={(e) => setPrayerRequest(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-colors"
                        placeholder="Enter your email"
                        data-testid="input-prayer-email"
                      />
                    </div>

                    <div>
                      <label htmlFor="request" className="block font-montserrat font-semibold text-deepPurple mb-2">
                        Prayer Request
                      </label>
                      <textarea
                        id="request"
                        required
                        rows={5}
                        value={prayerRequest.request}
                        onChange={(e) => setPrayerRequest(prev => ({ ...prev, request: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-colors resize-none"
                        placeholder="Share your prayer request..."
                        data-testid="input-prayer-request"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="private"
                        checked={prayerRequest.isPrivate}
                        onChange={(e) => setPrayerRequest(prev => ({ ...prev, isPrivate: e.target.checked }))}
                        className="w-5 h-5 rounded border-gray-300 text-gold focus:ring-gold"
                        data-testid="checkbox-private"
                      />
                      <label htmlFor="private" className="text-gray-600">
                        Keep my request confidential (shared only with pastoral team)
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-deepPurple text-white py-4 rounded-lg font-montserrat font-semibold hover:bg-deepPurple/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      data-testid="button-submit-prayer"
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Prayer Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
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
              <Heart className="w-16 h-16 text-gold mx-auto mb-8" />
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
                Join Our Prayer Team
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Do you have a heart for intercession? Join our prayer warriors and make a difference 
                through the power of prayer. We need committed prayer partners!
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-gold text-white px-8 py-4 rounded-lg font-montserrat font-semibold hover:bg-gold/90 transition-colors"
              >
                Become a Prayer Partner
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrayerMinistry;
