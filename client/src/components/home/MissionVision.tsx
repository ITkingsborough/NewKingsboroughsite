import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowDownCircle } from "lucide-react";
import { slideUp } from "@/lib/animations";

const cards = [
  {
    number: "01",
    title: "Who We Are",
    description:
      "To be a light in our city, transforming lives through faith, building authentic community, and creating positive change in our society.",
  },
  {
    number: "02",
    title: "What We Believe",
    description:
      "To lead people into a growing relationship with Jesus Christ through worship, community, discipleship, and service to others.",
  },
];

const MissionVision = () => {
  return (
    <section data-nav-theme="light" className="bg-[#F7F5F0] py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-14">
          <h2 className="inline-block bg-neutral-300/70 px-4 py-2 text-4xl md:text-6xl font-montserrat font-extrabold uppercase text-black">
            About Us
          </h2>
          <Link
            href="/about"
            className="hidden md:flex items-center gap-2 text-red-600 font-montserrat font-bold text-xs tracking-[0.2em] uppercase"
          >
            ( <ArrowDownCircle className="w-4 h-4" /> Learn More )
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(index * 0.15)}
              className="relative overflow-hidden rounded-xl border border-black bg-white p-8 md:p-10 min-h-[420px]"
            >
              <h3 className="text-3xl md:text-4xl font-montserrat font-extrabold uppercase text-black mb-4">
                {card.title}
              </h3>
              <p className="relative z-10 max-w-md text-base md:text-lg text-gray-700 leading-relaxed">
                {card.description}
              </p>
              <span className="pointer-events-none absolute -bottom-8 -right-2 font-montserrat font-extrabold text-[10rem] leading-none text-gray-100 select-none">
                {card.number}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp(0.25)}
          className="flex justify-center mt-10"
        >
          <Link
            href="/about"
            className="inline-flex items-center justify-center bg-deepPurple hover:bg-deepPurple/90 text-white font-montserrat font-semibold text-sm md:text-base px-8 py-4 rounded-lg transition-colors duration-300"
          >
            Learn More About Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;

