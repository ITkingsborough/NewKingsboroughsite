import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { slideUp } from "@/lib/animations";

interface OrganizationCardProps {
  title: string;
  tagline: string;
  description: string;
  image: string;
  link: string;
}

const organizations: OrganizationCardProps[] = [
  {
    title: "Hillingdon Foodbank",
    tagline: "Community Support",
    description:
      "Supporting those in need with essential food and supplies in the Hillingdon community.",
    image:
      "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    link: "https://hillingdon.foodbank.org.uk/",
  },
  {
    title: "CMC Nursery",
    tagline: "Early Years Education",
    description:
      "Providing nurturing childcare and early education in a Christ-centered environment.",
    image:
      "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    link: "https://test.cmcnursery.co.uk/",
  },
];

const Organizations = () => {
  return (
    <section data-nav-theme="light" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <span className="inline-flex items-center px-4 py-2 mb-5 rounded-full border border-gold/40 text-gold text-xs font-montserrat font-semibold tracking-[0.2em] uppercase">
            Our Organizations
          </span>
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-deepPurple">
            Extending Our Reach
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-darkGray mt-4">
            Beyond our church walls, we partner with and support organizations
            that serve our community every day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {organizations.map((org, index) => (
            <motion.a
              key={org.title}
              href={org.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl h-[360px] md:h-[420px] block"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(index * 0.15)}
            >
              <img
                src={org.image}
                alt={org.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8">
                <span className="text-gold text-xs font-montserrat font-semibold uppercase tracking-[0.2em] mb-2">
                  {org.tagline}
                </span>
                <h3 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-3">
                  {org.title}
                </h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-5 max-w-md">
                  {org.description}
                </p>
                <span className="inline-flex items-center gap-2 text-white font-montserrat font-semibold text-sm uppercase tracking-wide border-b border-white/40 pb-1 w-fit transition-colors group-hover:text-gold group-hover:border-gold">
                  Visit Site
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Organizations;
