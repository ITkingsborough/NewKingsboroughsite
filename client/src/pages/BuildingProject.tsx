import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { slideUp } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { leaders } from '@/lib/data';

const BuildingProject = () => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankDetails = [
    { label: 'Account Name', value: 'Kingsborough Centre' },
    { label: 'Bank Name', value: 'Barclays' },
    { label: 'Sort Code', value: '20-89-16' },
    { label: 'Account Number', value: '80932892' },
    { label: 'Reference', value: 'ATB Building Project' },
  ];

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    toast({ title: 'Copied to clipboard', description: `${label}: ${value}` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const leadPastor = leaders.find((l) => l.role === 'Apostolic Head') || leaders[1];

  return (
    <>
      <Helmet>
        <title>ATB Building Project | Kingsborough Church</title>
        <meta
          name="description"
          content="Join Kingsborough Church in supporting the ATB Building Project — building a lasting home for worship, community, and ministry."
        />
      </Helmet>

      <div className="pt-24">
        {/* Hero */}
        <section
          data-nav-theme="dark"
          className="relative h-[70vh] min-h-[480px] flex items-center parallax"
          style={{ backgroundImage: `url('/images/ATB%20BUILDING.jpeg')` }}
        >
          <div className="absolute inset-0 overlay-purple"></div>
          <div className="container mx-auto px-4 lg:px-8 z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={slideUp()} className="max-w-3xl mx-auto">
              <span className="inline-flex items-center px-4 py-2 mb-6 rounded-full border border-gold/40 text-gold text-xs font-montserrat font-semibold tracking-[0.2em] uppercase">
                ATB Building Project
              </span>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-montserrat font-extrabold uppercase leading-[0.95] text-white mb-6 text-shadow">
                Build With Us
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-light mb-10 max-w-2xl mx-auto">
                Your support helps build a lasting home for Kingsborough Church — a place to worship,
                grow, and welcome every soul God sends our way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/giving"
                  className="inline-flex items-center justify-center bg-gold text-deepPurple font-montserrat font-semibold text-sm md:text-base px-8 py-4 rounded-lg hover:bg-gold/90 transition-colors duration-300"
                >
                  Give Now
                </Link>
                <a
                  href="#ways-to-give"
                  className="inline-flex items-center justify-center border-2 border-white text-white font-montserrat font-semibold text-sm md:text-base px-8 py-4 rounded-lg hover:bg-white hover:text-deepPurple transition-colors duration-300"
                >
                  Ways To Give
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Ways to Give */}
        <section id="ways-to-give" className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              className="max-w-2xl mx-auto text-center mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <span className="inline-flex items-center px-4 py-2 mb-4 rounded-full border border-gold/40 text-gold text-xs font-montserrat font-semibold tracking-[0.2em] uppercase">
                Ways To Give
              </span>
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-deepPurple">
                Support The Building Project
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Bank Transfer */}
              <motion.div
                className="rounded-xl border border-gray-200 bg-white shadow-sm p-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
              >
                <h3 className="text-xl font-montserrat font-bold text-deepPurple mb-2">Bank Transfer</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Give directly using the account details below. Please use the reference provided.
                </p>
                <dl className="space-y-3">
                  {bankDetails.map((detail) => (
                    <div key={detail.label} className="flex items-center justify-between gap-4">
                      <div>
                        <dt className="text-[11px] uppercase tracking-wide text-gray-400">{detail.label}</dt>
                        <dd className="text-sm font-montserrat font-semibold text-deepPurple">{detail.value}</dd>
                      </div>
                      <button
                        onClick={() => handleCopy(detail.label, detail.value)}
                        aria-label={`Copy ${detail.label}`}
                        className="shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"
                      >
                        {copiedField === detail.label ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </dl>
              </motion.div>

              {/* Give Online */}
              <motion.div
                className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 flex flex-col"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.15)}
              >
                <h3 className="text-xl font-montserrat font-bold text-deepPurple mb-2">Give Online</h3>
                <p className="text-sm text-gray-500 mb-6 flex-1">
                  Visit our Giving page for all our online giving options, including one-time and recurring gifts.
                </p>
                <Link
                  href="/giving"
                  className="inline-flex items-center justify-center bg-gold text-deepPurple font-montserrat font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors"
                >
                  Go To Giving Page
                </Link>
              </motion.div>

              {/* Give In Person */}
              <motion.div
                className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 md:col-span-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.3)}
              >
                <h3 className="text-xl font-montserrat font-bold text-deepPurple mb-2">Give In Person</h3>
                <p className="text-sm text-gray-500">
                  You can also give during any of our Sunday or midweek services — simply mark your gift as
                  "ATB Building Project" on the offering envelope or card reader.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* The Vision For Our Building */}
        <section className="py-20 bg-deepPurple text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <span className="inline-flex items-center px-4 py-2 mb-6 rounded-full border border-gold/40 text-gold text-xs font-montserrat font-semibold tracking-[0.2em] uppercase">
                Expanding Our Reach
              </span>
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-8">
                The Vision For Our Building
              </h2>
              <blockquote className="text-lg md:text-xl text-white/85 leading-relaxed italic mb-8">
                "This building project is more than bricks and mortar — it is a lasting home where every soul
                can encounter God, grow in faith, and belong to a family. We are believing God for the
                resources to build a house that will serve our church family and community for generations
                to come. Thank you for partnering with us and giving sacrificially towards this vision."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                {leadPastor?.image && (
                  <img
                    src={leadPastor.image}
                    alt={leadPastor.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold"
                  />
                )}
                <div className="text-left">
                  <p className="font-montserrat font-semibold">{leadPastor?.name}</p>
                  <p className="text-white/60 text-sm">{leadPastor?.role}, Kingsborough Church</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-deepPurple mb-6">
                Give To Kingsborough Church
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/giving"
                  className="inline-flex items-center justify-center bg-gold text-deepPurple font-montserrat font-semibold text-sm md:text-base px-8 py-4 rounded-full hover:bg-gold/90 transition-colors"
                >
                  Give Now
                </Link>
                <a
                  href="#ways-to-give"
                  className="inline-flex items-center justify-center border-2 border-deepPurple text-deepPurple font-montserrat font-semibold text-sm md:text-base px-8 py-4 rounded-full hover:bg-deepPurple hover:text-white transition-colors"
                >
                  Building Project
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BuildingProject;

