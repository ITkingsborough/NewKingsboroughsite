import {
  EventItem,
  SermonItem,
  MinistryItem,
  LeaderItem,
  MagazineItem,
} from "./types";

// Leaders data
export const leaders: LeaderItem[] = [
  {
    id: 1,
    name: "Apostle Tunde & Toyin Balogun",
    role: "Senior Pastor & Founder",
    bio: "With over two decades of ministry experience, Apostle Tunde Balogun leads Kingsborough Church with wisdom, integrity, and genuine compassion. His visionary leadership has transformed countless lives through powerful teaching, prophetic ministry, and a heart for community service. He creates an atmosphere of faith and love where people discover their purpose and grow in their relationship with God.",
    image: "/pastor-couple.png",
  },
  {
    id: 2,
    name: "Pastor Steven Omotayo",
    role: "Resident Pastor",
    bio: "Pastor Steven oversees the day-to-day operations and strategic direction of the church. With a background in business administration and theology, he brings organizational excellence and spiritual depth to leadership. His passion is equipping believers to live out their faith in every area of life and building systems that support sustainable growth..",
    image:
      "/uploads/gallery/PSO.jpg",
  },
  {
    id: 3,
    name: "Pastor Christine Bamigbola",
    role: "Executive Pastor",
    bio: "Pastor Christine is a dynamic teacher and compassionate leader who brings a unique blend of spiritual insight and practical wisdom to His ministry. She oversees ministries and pastoral care, creating spaces where people experience healing, growth, and authentic community. Her heart for worship and excellence inspires everyone around her",
    image:
      "/uploads/gallery/PC.jpg",
  },
  {
    id: 4,
    name: "Pastor Segun Oyinloye",
    role: "Youth & Young Adults Pastor",
    bio: "Pastor Segun is passionate about raising up the next generation of believers who are bold, authentic, and deeply rooted in their faith. He leads the Centre Point young adults ministry and youth programs with creativity and energy. .",
    image:
      "/uploads/gallery/PS.jpg",
  },
  {
    id: 5,
    name: "Pastor Emmanuel Daudu",
    role: "Worship & Creative Arts Pastor",
    bio: "Pastor Emmanuel leads our worship ministry with a heart for God's presence and excellence in creativity. A gifted musician and songwriter,",
    image:
      "/uploads/gallery/PE.jpg",
  },
  {
    id: 6,
    name: "Pastor Bodinga Sambo",
    role: "Community Outreach Pastor",
    bio: "Pastor Bodinga leads our community outreach initiatives including the Hillingdon Foodbank and partnership programs. His compassion for the marginalized and commitment to social justice inspire our congregation to live out the gospel through practical service. ",
    image:
      "/uploads/gallery/PBO.png",
  },
];

// Ministries data
export const ministries: MinistryItem[] = [
  {
    id: 1,
    title: "Worship Ministry",
    description:
      "Join our team of musicians, vocalists, and production crew to create meaningful worship experiences.",
    image:
      "/uploads/gallery/67993630bb7f463a5b9c6b0a_worship-672c02982a03e589238fc443_62f285c4f9aa3441840257d6_nathan-mullet-pmiW630yDPE-unsplash.jpeg",
  },
  {
    id: 2,
    title: "KingsKid",
    description:
      "Creating a fun, safe environment where children can learn about God's love through age-appropriate activities.",
    image:
      "/uploads/gallery/IMG_1177.JPG",
  },
  {
    id: 3,
    title: "Centre Point",
    description:
      "A dynamic community where young adults connect with each other and grow in their faith through relevant teaching.",
    image:
      "/uploads/gallery/IMG_7832.JPG",
  },
  {
    id: 4,
    title: "Media Ministry",
    description:
      "Connect with others in weekly gatherings where you can build relationships, study Scripture, and support one another.",
    image:
      "/uploads/gallery/MEDIA.jpg",
  },
  {
    id: 5,
    title: "Community Outreach",
    description:
      "Serving our local community through various initiatives including food drives, homeless ministry, and community events.",
    image:
      "/uploads/gallery/outtt.jpg",
  },
  {
    id: 6,
    title: "Prayer Ministry",
    description:
      "Dedicated to praying for the needs of our church, community, and world through weekly prayer gatherings.",
    image:
      "/uploads/gallery/prayer22.jpg",
  },
];

// Events data
export const events: EventItem[] = [
  {
    id: 1,
    title: "Sunday Worship Service",
    date: "Every Sunday",
    time: "9:00 AM & 11:00 AM",
    location: "Main Sanctuary",
    description:
      "Join us for a time of inspirational worship, relevant teaching, and warm community.",
    image:
      "/uploads/gallery/67993630bb7f463a5b9c6b0a_worship-672c02982a03e589238fc443_62f285c4f9aa3441840257d6_nathan-mullet-pmiW630yDPE-unsplash.jpeg",
  },
  {
    id: 2,
    title: "Community Dinner",
    date: "October 20, 2023",
    time: "6:30 PM",
    location: "Fellowship Hall",
    description:
      "Enjoy a delicious meal and meaningful conversation with others from our church family.",
    image:
      "/uploads/gallery/HOP2.JPG",
  },
  {
    id: 3,
    title: "Encounter Worship Night",
    date: "October 25, 2023",
    time: "7:00 PM",
    location: "Main Sanctuary",
    description:
      "A special evening of extended worship, prayer, and seeking God's presence together.",
    image:
      "/uploads/gallery/HOP.jpg",
  },
];

// Sermons data
export const sermons: SermonItem[] = [
  {
    id: 1,
    title: "Finding Peace in Chaos",
    speaker: "Apostle Tunde Balogun",
    date: "April 14, 2024",
    series: "Peace Series",
    description:
      "Discover biblical principles for maintaining inner peace during life's most challenging seasons.",
    image:
      "/uploads/gallery/prayer22.jpg",
  },
  {
    id: 2,
    title: "The Heart of Worship",
    speaker: "Pastor Toyin Balogun",
    date: "April 7, 2024",
    series: "Worship Series",
    description:
      "Exploring what it means to worship God in spirit and truth, beyond just music and songs.",
    image:
      "/uploads/gallery/67993630bb7f463a5b9c6b0a_worship-672c02982a03e589238fc443_62f285c4f9aa3441840257d6_nathan-mullet-pmiW630yDPE-unsplash.jpeg",
  },
  {
    id: 3,
    title: "Destiny and Purpose",
    speaker: "Apostle Tunde Balogun",
    date: "March 31, 2024",
    series: "Purpose Series",
    description:
      "Understanding God's divine plan for your life and how to walk in your God-given purpose.",
    image:
      "/uploads/gallery/IMG_7832.JPG",
  },
];

// Magazine data
export const magazines: MagazineItem[] = [
  {
    id: 1,
    title: "Faith In Action",
    date: "April 2024",
    coverImage:
      "/uploads/gallery/HOP.jpg",
    summary:
      "This month's edition features testimonies of transformation, insights on walking in your God-given purpose, and exclusive interviews with Apostle Tunde and Pastor Toyin on the power of faith.",
    pdfUrl: "#",
  },
  {
    id: 2,
    title: "Kingdom Living",
    date: "March 2024",
    coverImage:
      "/uploads/gallery/HOP2.JPG",
    summary:
      "Explore biblical principles for living as citizens of God's kingdom, with practical teachings on applying kingdom values in your everyday life, family, and community.",
    pdfUrl: "#",
  },
  {
    id: 3,
    title: "Revival & Restoration",
    date: "February 2024",
    coverImage:
      "/uploads/gallery/IMG_1177.JPG",
    summary:
      "Dedicated to spiritual renewal, this edition presents powerful teachings on prayer, worship, and the move of the Holy Spirit, along with stories of healing and restoration.",
    pdfUrl: "#",
  },
];
