const About = () => {
  return (
    <section
      id="about"
      data-nav-theme="dark"
      className="relative h-[70vh] min-h-[480px] overflow-hidden"
    >
      <img
        src="/uploads/gallery/Our Story.jpg"
        alt="Kingsborough Church - Our Story"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/45" />
    </section>
  );
};

export default About;
