import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { slideUp, staggerContainer } from '@/lib/animations';
import { useState } from 'react';
import { ShoppingCart, Star, Filter, Search, BookOpen, Music, Gift, X, Plus, Minus, Trash2 } from 'lucide-react';

interface CartItem {
  productId: number;
  quantity: number;
}

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
      image: "/uploads/gallery/HOP.jpg",
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
      image: "/uploads/gallery/67993630bb7f463a5b9c6b0a_worship-672c02982a03e589238fc443_62f285c4f9aa3441840257d6_nathan-mullet-pmiW630yDPE-unsplash.jpeg",
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
      image: "/uploads/gallery/prayer22.jpg",
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
      image: "/uploads/gallery/IMG_1177.JPG",
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
      image: "/uploads/gallery/HOP2.JPG",
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
      image: "/uploads/gallery/PS.jpg",
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
      image: "/uploads/gallery/PC.jpg",
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
      image: "/uploads/gallery/PE.jpg",
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
    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      if (existingItem) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartItemCount = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getCartItems = () => {
    return cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return { ...item, product };
    }).filter(item => item.product);
  };

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
              src="/uploads/gallery/HOP.jpg" 
              alt="Books and faith items" 
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          
          <div className="relative container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer()}
              className="text-center"
            >
              <motion.h1 
                variants={slideUp()}
                className="text-5xl md:text-6xl font-montserrat font-bold mb-6"
              >
                Church Shop
              </motion.h1>
              <motion.p 
                variants={slideUp()}
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              >
                Discover inspiring books, worship music, and faith-based gifts to strengthen your spiritual journey
              </motion.p>
              
              <motion.div
                variants={slideUp()}
                className="flex items-center justify-center space-x-4"
              >
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center hover:bg-white/30 transition-colors duration-300"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span className="font-medium">{getCartItemCount()} items in cart</span>
                </button>
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

        {/* Cart Modal */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsCartOpen(false)}></div>
              
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-montserrat font-bold text-deepPurple">Shopping Cart</h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {getCartItems().length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h4 className="text-xl font-montserrat font-semibold text-gray-600 mb-2">Your cart is empty</h4>
                    <p className="text-gray-500 mb-6">Add some items to get started</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-deepPurple hover:bg-lilac text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="max-h-96 overflow-y-auto mb-6">
                      {getCartItems().map((item) => (
                        <div key={item.productId} className="flex items-center space-x-4 py-4 border-b border-gray-200">
                          <img
                            src={item.product!.image}
                            alt={item.product!.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-montserrat font-semibold text-deepPurple">{item.product!.name}</h4>
                            <p className="text-sm text-gray-600">{item.product!.author}</p>
                            <p className="text-lg font-bold text-deepPurple">£{item.product!.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-300"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-300"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors duration-300"
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-montserrat font-semibold text-deepPurple">Total:</span>
                        <span className="text-2xl font-bold text-deepPurple">£{getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                        >
                          Continue Shopping
                        </button>
                        <button className="flex-1 bg-deepPurple hover:bg-lilac text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                          Checkout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

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