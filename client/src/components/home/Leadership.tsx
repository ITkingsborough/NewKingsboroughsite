import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ExternalLink } from 'lucide-react';
import { leaders } from '@/lib/data';

const pillars = [
  {
    title: 'What He Believed',
    text: 'He believed the Gospel is the power of God for transformation, and that every life can be restored through Christ.'
  },
  {
    title: 'His Vision',
    text: 'He envisioned a church that was prayerful, evangelistic, and deeply rooted in biblical truth and practical discipleship.'
  },
  {
    title: 'His Values',
    text: 'His ministry was shaped by humility, integrity, compassion, prayer, and a relentless desire to see people flourish in purpose.'
  }
];

const Leadership = () => {
  return (
    <section data-nav-theme="dark" className="bg-[#070707] py-6 md:py-10">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-2xl bg-[#070707]">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative h-[260px] self-center overflow-hidden md:h-[360px] lg:h-[430px]">
            <img
              src={leaders[0].image}
              alt={leaders[0].name}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: '50% 75%' }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/35" />
          </div>

          <div className="flex items-center bg-[#070707] px-8 py-8 md:px-10 lg:px-12 xl:px-16">
            <motion.div
              className="w-full max-w-xl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37] text-xl font-bold text-[#d4af37]">
                  ∞
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d4af37]">
                  Global
                </span>
              </div>

              <h2 className="mt-6 text-center text-2xl font-montserrat font-bold uppercase tracking-tight text-white md:text-3xl lg:text-left lg:text-[2.5rem] lg:leading-none">
                Our Lead Pastor
              </h2>

              <div className="mt-3 flex flex-col items-center gap-2 lg:items-start">
                <span className="inline-block rounded-full border border-[#d4af37]/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]/80">
                  In Loving Memory
                </span>
                <p className="font-montserrat text-sm tracking-widest text-white/50">
                  {leaders[0].years}
                </p>
              </div>

              <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/75 md:text-[0.95rem] lg:text-[0.88rem]">
                <p>
                  Apostle Tunde Balogun was the visionary founder of Kingsborough Church, a man of unwavering faith,
                  prophetic grace, and deep love for God’s people. His ministry was marked by a rare combination of spiritual
                  authority, humility, and practical wisdom that drew people closer to Christ.
                </p>
                <p>
                  He believed the Gospel is the power of God to transform lives and that every believer is called to live with
                  purpose, courage, and obedience. His teachings continuously called people to deeper prayer, stronger faith,
                  and a life rooted in the Word of God.
                </p>
                <p>
                  His vision for the church was to raise a community of disciples who would worship genuinely, serve faithfully,
                  and impact generations with the love of Jesus. Through his values of integrity, compassion, holiness, and
                  intentional discipleship, he shaped a ministry culture that was both spiritual and practical.
                </p>
              </div>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
                {pillars.map((pillar) => (
                  <div key={pillar.title} className="rounded-md border border-white/10 bg-white/5 p-2.5 text-left">
                    <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                      {pillar.title}
                    </p>
                    <p className="text-[11px] leading-relaxed text-white/70">{pillar.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:border-[#d4af37] hover:text-[#d4af37]"
                >
                  Read More
                </Link>
                <a
                  href="https://www.forevermissed.com/apostletunde-balogun/tributes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/60 px-7 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
                >
                  View All Tributes
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Leadership;
