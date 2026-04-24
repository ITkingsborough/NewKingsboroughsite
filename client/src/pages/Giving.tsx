import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { Helmet } from 'react-helmet';

const Giving = () => {
  const bankDetails = [
    { label: 'Account Name', value: 'Kingsborough Church' },
    { label: 'Bank Name', value: 'Your Bank Name Here' },
    { label: 'Sort Code', value: '00-00-00' },
    { label: 'Account Number', value: '00000000' },
    { label: 'Reference', value: 'Tithe / Offering / Building Fund' },
  ];

  return (
    <>
      <Helmet>
        <title>Giving | Kingsborough Church</title>
        <meta name="description" content="Support the mission and ministry of Kingsborough Church through your generous giving." />
      </Helmet>
      <div className="pt-24">
        {/* Hero Section */}
        <section data-nav-theme="dark" className="relative h-80 md:h-96 flex items-center parallax" style={{ backgroundImage: `url('/uploads/gallery/HOP.jpg')` }}>
          <div className="absolute inset-0 overlay-purple"></div>
          <div className="container mx-auto px-4 lg:px-8 z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp()}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4 tracking-tight text-shadow">Give</h1>
              <p className="text-xl text-white opacity-90 font-light">
                Your generosity helps fuel our mission to reach people with the love of Christ.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Scripture Quote */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <blockquote className="font-playfair text-2xl md:text-3xl text-deepPurple italic mb-4">
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
              </blockquote>
              <p className="text-lg font-montserrat text-gray-600">2 Corinthians 9:7</p>
            </motion.div>
          </div>
        </section>

        {/* Giving Form Section */}
        <section className="py-16 bg-lilac bg-opacity-5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Left Column - Giving Information */}
                <motion.div 
                  className="lg:w-1/2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideUp()}
                >
                  <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-8 text-white">
                    Why We Give
                  </h2>
                  
                  <p className="text-lg mb-6 text-white">
                    Giving is an act of worship and a response to God's generosity towards us. Your contributions help us fulfill our mission to reach people with the love of Christ and make a difference in our community and beyond.
                  </p>
                  
                  <div className="mb-10">
                    <h3 className="text-xl font-montserrat font-semibold mb-4 text-gold">Where Your Gift Goes</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <i className="fas fa-hands-helping text-gold mt-1 mr-3"></i>
                        <div>
                          <p className="font-semibold text-gold">Local Outreach</p>
                          <p className="text-sm text-white">Supporting those in need in our community through food pantries, assistance programs, and community events.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-globe-americas text-gold mt-1 mr-3"></i>
                        <div>
                          <p className="font-semibold text-gold">Global Missions</p>
                          <p className="text-sm text-white">Partnering with missionaries and organizations around the world to share God's love and meet physical needs.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-church text-gold mt-1 mr-3"></i>
                        <div>
                          <p className="font-semibold text-gold">Church Operations</p>
                          <p className="text-sm text-white">Maintaining our facilities, supporting staff, and creating environments where people can connect with God and others.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-child text-gold mt-1 mr-3"></i>
                        <div>
                          <p className="font-semibold text-gold">Next Generation</p>
                          <p className="text-sm text-white">Investing in children, youth, and young adult ministries to help the next generation grow in their faith.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mb-10">
                    <h3 className="text-xl font-montserrat font-semibold mb-4 text-gold">Ways to Give</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <i className="fas fa-church text-gold mt-1 mr-3"></i>
                        <div>
                          <p className="font-semibold text-gold">In Person</p>
                          <p className="text-sm text-white">During our Sunday services or at the church office Monday-Friday, 9am-5pm.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-envelope text-gold mt-1 mr-3"></i>
                        <div>
                          <p className="font-semibold text-gold">Mail</p>
                          <p className="text-sm text-white">Send checks to: Kingsborough Church, 215 High Street, Yiewsley, West Drayton, UB7 7QP</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-montserrat font-semibold mb-4">Questions About Giving?</h3>
                    <p className="mb-4">
                      If you have any questions about giving or would like more information about our finances, please contact our finance team.
                    </p>
                    <a href="mailto:finance@kingsboroughchurch.org" className="text-gold font-medium hover:underline">
                      accounts@kingsborough.org.uk
                    </a>
                  </div>
                </motion.div>
                
                {/* Right Column - Giving Methods */}
                <motion.div 
                  className="lg:w-1/2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideUp(0.2)}
                >
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                      <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center text-deepPurple">
                        Ways to Give
                      </h2>
                      <p className="text-center text-gray-600 mb-8">
                        Choose the giving method that works best for you. Update the placeholder details below with your church's live giving information.
                      </p>

                      <div className="space-y-6">
                        <div className="rounded-2xl border border-gray-200 p-6 bg-gray-50">
                          <div className="flex items-center gap-4 mb-5">
                            <div className="w-14 h-14 rounded-full bg-deepPurple/10 text-deepPurple flex items-center justify-center shrink-0">
                              <i className="fas fa-university text-2xl"></i>
                            </div>
                            <div>
                              <h3 className="text-xl font-montserrat font-semibold text-deepPurple">Bank Transfer</h3>
                              <p className="text-sm text-gray-600">Use the church bank details below for direct giving.</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {bankDetails.map((detail) => (
                              <div key={detail.label} className="rounded-xl bg-white border border-gray-200 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-1">{detail.label}</p>
                                <p className="text-base font-medium text-deepPurple break-words">{detail.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-blue-200 p-6 bg-blue-50">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                              <i className="fab fa-paypal text-2xl"></i>
                            </div>
                            <div>
                              <h3 className="text-xl font-montserrat font-semibold text-blue-900">PayPal Giving</h3>
                              <p className="text-sm text-blue-700">Share your PayPal giving link or PayPal email for quick online donations.</p>
                            </div>
                          </div>

                          <div className="rounded-xl bg-white border border-blue-100 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold mb-1">PayPal Link / Email</p>
                            <p className="text-base font-medium text-blue-900 break-words">paypal.me/yourchurchname or giving@yourchurch.org</p>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-gold/30 p-6 bg-gold/5">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                              <i className="fas fa-qrcode text-2xl"></i>
                            </div>
                            <div>
                              <h3 className="text-xl font-montserrat font-semibold text-deepPurple">Scan to Give</h3>
                              <p className="text-sm text-gray-600">Add your church giving QR code here so people can scan and give instantly.</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-center">
                            <div className="mx-auto md:mx-0 w-44 h-44 rounded-2xl border-2 border-dashed border-gold bg-white flex flex-col items-center justify-center text-center p-4">
                              <i className="fas fa-qrcode text-4xl text-gold mb-3"></i>
                              <p className="text-sm font-semibold text-deepPurple">QR Code Placeholder</p>
                              <p className="text-xs text-gray-500 mt-1">Replace with your real giving QR code image</p>
                            </div>

                            <div className="space-y-3">
                              <div className="rounded-xl bg-white border border-gold/20 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-1">How to use</p>
                                <p className="text-gray-700">Open your camera or banking app, scan the code, and follow the giving instructions on your phone.</p>
                              </div>
                              <div className="rounded-xl bg-white border border-gold/20 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-1">Recommended asset</p>
                                <p className="text-gray-700">Add a square PNG or JPG QR code image to the public folder and swap this placeholder with the real image.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-xl font-montserrat font-semibold mb-3 text-deepPurple">Need Help?</h3>
                      <p className="text-gray-600 mb-4">
                        If you need help setting up a bank transfer, PayPal gift, or QR code giving option, our finance team will be happy to assist.
                      </p>
                      <a href="mailto:accounts@kingsborough.org.uk" className="text-gold font-medium hover:underline">
                        accounts@kingsborough.org.uk
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tax Information Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                className="text-center mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
              >
                <h2 className="text-3xl font-montserrat font-bold mb-4 text-deepPurple">Additional Ways to Give</h2>
                <p className="text-lg max-w-3xl mx-auto">
                  Beyond financial gifts, there are many other ways to support our ministry.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="bg-lilac bg-opacity-5 p-6 rounded-lg"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={slideUp(0.1)}
                >
                  <div className="w-16 h-16 rounded-full bg-gold bg-opacity-20 flex items-center justify-center mb-4">
                    <i className="fas fa-hand-holding-heart text-gold text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-montserrat font-semibold mb-3 text-gold">Non-Cash Gifts</h3>
                  <p className="mb-4 text-white">
                    Donate stocks, mutual funds, or other securities for potential tax benefits while supporting our mission.
                  </p>
                  <a href="#" className="text-gold font-montserrat font-medium hover:underline">Learn More</a>
                </motion.div>
                
                <motion.div 
                  className="bg-lilac bg-opacity-5 p-6 rounded-lg"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={slideUp(0.2)}
                >
                  <div className="w-16 h-16 rounded-full bg-gold bg-opacity-20 flex items-center justify-center mb-4">
                    <i className="fas fa-file-signature text-gold text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-montserrat font-semibold mb-3 text-gold">Legacy Giving</h3>
                  <p className="mb-4 text-white">
                    Include Kingsborough Church in your will or estate plan to leave a lasting impact for generations to come.
                  </p>
                  <a href="#" className="text-gold font-montserrat font-medium hover:underline">Learn More</a>
                </motion.div>
                
                <motion.div 
                  className="bg-lilac bg-opacity-5 p-6 rounded-lg"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={slideUp(0.3)}
                >
                  <div className="w-16 h-16 rounded-full bg-gold bg-opacity-20 flex items-center justify-center mb-4">
                    <i className="fas fa-handshake text-gold text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-montserrat font-semibold mb-3 text-gold">Matching Gifts</h3>
                  <p className="mb-4 text-white">
                    Many employers match charitable donations. Check if your company has a matching gift program to double your impact.
                  </p>
                  <a href="#" className="text-gold font-montserrat font-medium hover:underline">Learn More</a>
                </motion.div>
              </div>
              
              <motion.div 
                className="mt-16 bg-deepPurple text-white p-8 md:p-12 rounded-lg text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.4)}
              >
                <h3 className="text-2xl font-montserrat font-semibold mb-4">
                  Need Help with Your Giving?
                </h3>
                <p className="mb-6 max-w-2xl mx-auto">
                  Our team is here to assist you with any questions about donations, tax receipts, or other ways to support our ministry.
                </p>
                <button className="bg-white text-deepPurple hover:bg-gray-100 px-6 py-3 rounded font-montserrat font-medium transition-all duration-300">
                  Contact Finance Team
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Giving;
