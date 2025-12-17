import { EventItem, SermonItem, MinistryItem, LeaderItem, MagazineItem } from './types';

// Leaders data
export const leaders: LeaderItem[] = [
  {
    id: 1,
    name: "Apostle Tunde & Toyin Balogun",
    role: "Senior Pastor & Founder",
    bio: "With over two decades of ministry experience, Apostle Tunde Balogun leads Kingsborough Church with wisdom, integrity, and genuine compassion. His visionary leadership has transformed countless lives through powerful teaching, prophetic ministry, and a heart for community service. He creates an atmosphere of faith and love where people discover their purpose and grow in their relationship with God.",
    image: "/pastor-couple.png"
  },
  {
    id: 2,
    name: "Pastor Steven Omotayo",
    role: "Resident Pastor",
    bio: "Pastor Toyin Balogun is a dynamic teacher and compassionate leader who brings a unique blend of spiritual insight and practical wisdom to her ministry. She oversees women's ministries and pastoral care, creating spaces where people experience healing, growth, and authentic community. Her heart for worship and excellence inspires everyone around her.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Pastor Christine Bamigbola",
    role: "Executive Pastor",
    bio: "Pastor David oversees the day-to-day operations and strategic direction of the church. With a background in business administration and theology, he brings organizational excellence and spiritual depth to leadership. His passion is equipping believers to live out their faith in every area of life and building systems that support sustainable growth.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Pastor Segun Oyinloye",
    role: "Youth & Young Adults Pastor",
    bio: "Pastor Grace is passionate about raising up the next generation of believers who are bold, authentic, and deeply rooted in their faith. She leads The Crown young adults ministry and youth programs with creativity and energy. Her relatable teaching style and genuine care for young people create an environment where they thrive spiritually and socially.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Pastor Emmanuel Daudu",
    role: "Worship & Creative Arts Pastor",
    bio: "Pastor Samuel leads our worship ministry with a heart for God's presence and excellence in creativity. A gifted musician and songwriter, he trains and mentors worship teams across our campuses. His vision is to create worship experiences that draw people into authentic encounters with God and express the beauty of His kingdom through the arts.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Pastor Bodinga Sambo",
    role: "Community Outreach Pastor",
    bio: "Pastor Blessing leads our community outreach initiatives including the Hillingdon Foodbank and partnership programs. Her compassion for the marginalized and commitment to social justice inspire our congregation to live out the gospel through practical service. She believes the church should be the hands and feet of Jesus in every neighborhood.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

// Ministries data
export const ministries: MinistryItem[] = [
  {
    id: 1,
    title: "Worship Ministry",
    description: "Join our team of musicians, vocalists, and production crew to create meaningful worship experiences.",
    image: "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Kids Ministry",
    description: "Creating a fun, safe environment where children can learn about God's love through age-appropriate activities.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Youth Ministry",
    description: "A dynamic community where teens connect with each other and grow in their faith through relevant teaching.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Small Groups",
    description: "Connect with others in weekly gatherings where you can build relationships, study Scripture, and support one another.",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "Community Outreach",
    description: "Serving our local community through various initiatives including food drives, homeless ministry, and community events.",
    image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "Prayer Ministry",
    description: "Dedicated to praying for the needs of our church, community, and world through weekly prayer gatherings.",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

// Events data
export const events: EventItem[] = [
  {
    id: 1,
    title: "Sunday Worship Service",
    date: "Every Sunday",
    time: "9:00 AM & 11:00 AM",
    location: "Main Sanctuary",
    description: "Join us for a time of inspirational worship, relevant teaching, and warm community.",
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Community Dinner",
    date: "October 20, 2023",
    time: "6:30 PM",
    location: "Fellowship Hall",
    description: "Enjoy a delicious meal and meaningful conversation with others from our church family.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Encounter Worship Night",
    date: "October 25, 2023",
    time: "7:00 PM",
    location: "Main Sanctuary",
    description: "A special evening of extended worship, prayer, and seeking God's presence together.",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

// Sermons data
export const sermons: SermonItem[] = [
  {
    id: 1,
    title: "Finding Peace in Chaos",
    speaker: "Apostle Tunde Balogun",
    date: "April 14, 2024",
    series: "Peace Series",
    description: "Discover biblical principles for maintaining inner peace during life's most challenging seasons.",
    image: "https://images.unsplash.com/photo-1515569371593-46e0d3921359?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "The Heart of Worship",
    speaker: "Pastor Toyin Balogun",
    date: "April 7, 2024",
    series: "Worship Series",
    description: "Exploring what it means to worship God in spirit and truth, beyond just music and songs.",
    image: "https://images.unsplash.com/photo-1501740326664-5571ff5e30a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Destiny and Purpose",
    speaker: "Apostle Tunde Balogun",
    date: "March 31, 2024",
    series: "Purpose Series",
    description: "Understanding God's divine plan for your life and how to walk in your God-given purpose.",
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

// Magazine data
export const magazines: MagazineItem[] = [
  {
    id: 1,
    title: "Faith In Action",
    date: "April 2024",
    coverImage: "https://images.unsplash.com/photo-1603659297485-f85408aeb499?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    summary: "This month's edition features testimonies of transformation, insights on walking in your God-given purpose, and exclusive interviews with Apostle Tunde and Pastor Toyin on the power of faith.",
    pdfUrl: "#"
  },
  {
    id: 2,
    title: "Kingdom Living",
    date: "March 2024",
    coverImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    summary: "Explore biblical principles for living as citizens of God's kingdom, with practical teachings on applying kingdom values in your everyday life, family, and community.",
    pdfUrl: "#"
  },
  {
    id: 3,
    title: "Revival & Restoration",
    date: "February 2024",
    coverImage: "https://images.unsplash.com/photo-1621777150504-95cd48f44619?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    summary: "Dedicated to spiritual renewal, this edition presents powerful teachings on prayer, worship, and the move of the Holy Spirit, along with stories of healing and restoration.",
    pdfUrl: "#"
  }
];
