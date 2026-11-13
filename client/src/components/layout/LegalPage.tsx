import { ReactNode } from 'react';
import { Helmet } from 'react-helmet';

interface LegalPageProps {
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
}

const LegalPage = ({ title, description, lastUpdated, children }: LegalPageProps) => (
  <>
    <Helmet>
      <title>{title} | Kingsborough Church</title>
      <meta name="description" content={description} />
    </Helmet>

    <section data-nav-theme="dark" className="bg-deepPurple text-white pt-36 pb-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="font-montserrat font-bold text-3xl md:text-5xl mb-4">{title}</h1>
        <p className="text-gray-300">Last updated: {lastUpdated}</p>
      </div>
    </section>

    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-gray-700 leading-relaxed space-y-4 [&_h2]:font-montserrat [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-deepPurple [&_h2]:pt-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-gold [&_a]:underline">
        {children}
      </div>
    </section>
  </>
);

export default LegalPage;
