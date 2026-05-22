import pkg from 'pg';
const { Client } = pkg;

const client = new Client({ connectionString: process.env.DATABASE_URL });

const events = [
  {
    title: 'Friday Vigil',
    date: '2026-05-22',
    time: '10:00 PM',
    location: 'Main Sanctuary',
    description: 'Join us for an overnight prayer vigil as we seek God\'s face together in worship and intercession.',
    image: '/uploads/gallery/prayer22.jpg',
    featured: true,
  },
  {
    title: 'Launch of Our Transformative Express Service',
    date: '2026-05-24',
    time: '8:30 AM',
    location: 'Main Sanctuary',
    description: 'Be part of the exciting launch of our brand new Express Service — a powerful, focused time of worship and the Word designed to ignite your week.',
    image: '/uploads/gallery/67993630bb7f463a5b9c6b0a_worship-672c02982a03e589238fc443_62f285c4f9aa3441840257d6_nathan-mullet-pmiW630yDPE-unsplash.jpeg',
    featured: true,
  },
  {
    title: 'Wednesday Pure Worship Service',
    date: '2026-05-27',
    time: '7:00 PM',
    location: 'Main Sanctuary',
    description: 'An evening dedicated entirely to pure, undistracted worship. Come and experience the fullness of God\'s presence.',
    image: '/uploads/gallery/HOP.jpg',
    featured: true,
  },
  {
    title: 'Outreach Sunday',
    date: '2026-05-31',
    time: '10:00 AM',
    location: 'Community & Surrounding Areas',
    description: 'Join us as we take the love of God beyond our walls and serve our local community. Everyone is welcome to take part.',
    image: '/uploads/gallery/outtt.jpg',
    featured: true,
  },
];

await client.connect();
for (const e of events) {
  await client.query(
    'INSERT INTO events (title, date, time, location, description, image, featured) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [e.title, e.date, e.time, e.location, e.description, e.image, e.featured]
  );
  console.log('Inserted:', e.title);
}
await client.end();
console.log('All events inserted.');
