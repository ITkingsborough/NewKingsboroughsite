import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { slideUp, staggerContainer } from '@/lib/animations';
import { useState } from 'react';
import { ShoppingCart, Star, Filter, Search, BookOpen, Music, Gift } from 'lucide-react';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<number[]>([]);

  const categories = [
    { id: 'all', name: 'All Items', icon: Gift },
    { id: 'books', name: 'Books', icon: BookOpen },
    { id: 'music', name: 'Music & CDs', icon: Music },
    { id: 'gifts', name: 'Gifts', icon: Gift }
  ];

  const products = [
    {
      id: 1,
      name: "The Purpose Driven Life",
      author: "Rick Warren",
      price: 15.99,
      originalPrice: 19.99,
      category: 'books',
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      reviews: 127,
      description: "A spiritual journey to discover your purpose in life",
      featured: true
    },
    {
      id: 2,
      name: "Worship Collection Vol. 1",
      author: "Kingsborough Church",
      price: 12.99,
      category: 'music',
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      reviews: 89,
      description: "Inspiring worship songs from our Sunday services",
      featured: true
    },
    {
      id: 3,
      name: "Jesus Calling Devotional",
      author: "Sarah Young",
      price: 13.99,
      originalPrice: 16.99,
      category: 'books',
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      reviews: 203,
      description: "Daily devotions for a deeper relationship with Jesus"
    },
    {
      id: 4,
      name: "Christian Coffee Mug Set",
      author: "Faith Collection",
      price: 24.99,
      category: 'gifts',
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      reviews: 45,
      description: "Beautiful set of 2 mugs with inspirational verses"
    },
    {
      id: 5,
      name: "Hillsong Greatest Hits",
      author: "Hillsong United",
      price: 16.99,
      category: 'music',
      image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      reviews: 156,
      description: "Collection of powerful worship anthems"
    },
    {
      id: 6,
      name: "Case for Christ",
      author: "Lee Strobel",
      price: 14.99,
      originalPrice: 17.99,
      category: 'books',
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      reviews: 178,
      description: "A journalist's investigation into the evidence for Jesus"
    },
    {
      id: 7,
      name: "Faith Scripture Wall Art",
      author: "Blessed Home",
      price: 29.99,
      category: 'gifts',
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      reviews: 67,
      description: "Beautiful canvas print with faith-based scripture"
    },
    {
      id: 8,
      name: "Bethel Music Live",
      author: "Bethel Music",
      price: 15.99,
      category: 'music',
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      reviews: 134,
      description: "Live worship recording from Bethel Church"
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (productId: number) => {
    setCartItems(prev => [...prev, productId]);
  };

  const getCartItemCount = () => cartItems.length;

  return (
    <>
      <Helmet>
        <title>Church Shop | Kingsborough Church</title>
        <meta name="description" content="Browse our collection of Christian books, worship music, and faith-based gifts at the Kingsborough Church online shop." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-deepPurple to-lilac text-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-deepPurple/90 to-lilac/90"></div>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Books and faith items" 
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          
          <div className="relative container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center"
            >
              <motion.h1 
                variants={slideUp()}
                className="text-5xl md:text-6xl font-montserrat font-bold mb-6"
              >
                Church Shop
              </motion.h1>
              <motion.p 
                variants={slideUp(0.1)}
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              >
                Discover inspiring books, worship music, and faith-based gifts to strengthen your spiritual journey
              </motion.p>
              
              <motion.div
                variants={slideUp(0.2)}
                className="flex items-center justify-center space-x-4"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span className="font-medium">{getCartItemCount()} items in cart</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white shadow-sm">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search books, music, gifts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lilac focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <div className="flex space-x-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                          selectedCategory === category.id
                            ? 'bg-deepPurple text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium">{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-montserrat font-bold text-deepPurple mb-4">
                Featured Items
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hand-picked selections to inspire and strengthen your faith
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideUp(index * 0.1)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <div className="absolute top-3 left-3 bg-gold text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                    {product.originalPrice && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Sale
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-montserrat font-bold text-deepPurple mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{product.author}</p>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-gold fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-deepPurple">
                          £{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            £{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="bg-lilac hover:bg-deepPurple text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
                className="text-center py-16"
              >
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-gray-600 mb-2">
                  No items found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-deepPurple to-lilac text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-montserrat font-bold mb-6">
                Stay Updated
              </h2>
              <p className="text-xl mb-8">
                Subscribe to our newsletter and be the first to know about new arrivals, special offers, and exclusive church resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button className="bg-gold hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
              >
                <div className="w-16 h-16 bg-lilac bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-deepPurple" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-deepPurple mb-2">
                  Free Shipping
                </h3>
                <p className="text-gray-600">
                  On orders over £25 within the UK
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.1)}
              >
                <div className="w-16 h-16 bg-lilac bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-deepPurple" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-deepPurple mb-2">
                  Gift Wrapping
                </h3>
                <p className="text-gray-600">
                  Beautiful gift wrapping available for all items
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.2)}
              >
                <div className="w-16 h-16 bg-lilac bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-deepPurple" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-deepPurple mb-2">
                  Expert Recommendations
                </h3>
                <p className="text-gray-600">
                  Carefully curated by our pastoral team
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Shop;