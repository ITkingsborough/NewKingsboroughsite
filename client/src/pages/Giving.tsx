import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';

const Giving = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const isRecurring = searchParams.get('recurring') === 'true';

  // State for donation form
  const [donationForm, setDonationForm] = useState({
    amount: '50',
    fundType: 'general',
    frequency: isRecurring ? 'monthly' : 'one-time',
    customAmount: '',
    firstName: '',
    lastName: '',
    email: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    savePaymentInfo: false
  });

  const [submitted, setSubmitted] = useState(false);

  // Predefined donation amounts
  const donationAmounts = ['25', '50', '100', '250', '500', '1000'];

  // Handle changes to the donation form
  const handleDonationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setDonationForm(prev => ({ ...prev, [name]: target.checked }));
    } else if (name === 'amount' && value === 'custom') {
      setDonationForm(prev => ({ ...prev, amount: 'custom' }));
    } else {
      setDonationForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Donation form submitted:', donationForm);
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Giving | Kingsborough Church</title>
        <meta name="description" content="Support the mission and ministry of Kingsborough Church through your generous giving." />
      </Helmet>
      <div className="pt-24">
        {/* Hero Section */}
        <section className="relative h-80 md:h-96 flex items-center parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504025468847-0e438279542c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}>
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
                          <p className="text-sm text-white">Send checks to: Kingsborough Church, No 4 , New Windsor Street, Uxbridge , UB8 2TU</p>
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
                
                {/* Right Column - Donation Form */}
                <motion.div 
                  className="lg:w-1/2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideUp(0.2)}
                >
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    {submitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-check text-2xl"></i>
                        </div>
                        <h3 className="text-2xl font-montserrat font-semibold mb-4">Thank You for Your Generosity!</h3>
                        <p className="mb-6">
                          Your donation has been processed successfully. You should receive a confirmation email shortly.
                        </p>
                        <p className="text-lg font-medium mb-8">
                          {donationForm.amount === 'custom' 
                            ? `£${donationForm.customAmount}` 
                            : `£${donationForm.amount}`} 
                          {donationForm.frequency === 'one-time' ? '' : ` ${donationForm.frequency}`}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                          <button 
                            onClick={() => setSubmitted(false)}
                            className="btn-outline"
                          >
                            Make Another Donation
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-montserrat font-semibold mb-6 text-center">
                          {isRecurring ? 'Set Up Recurring Gift' : 'Make a Donation'}
                        </h2>
                        
                        <form onSubmit={handleDonationSubmit}>
                          {/* Gift Amount */}
                          <div className="mb-8">
                            <label className="block text-gray-700 font-semibold mb-2">
                              Select Gift Amount
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {donationAmounts.map((amount) => (
                                <button
                                  key={amount}
                                  type="button"
                                  className={`py-3 rounded-md ${
                                    donationForm.amount === amount
                                      ? 'bg-gold text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                  onClick={() => setDonationForm(prev => ({ ...prev, amount }))}
                                >
                                  £{amount}
                                </button>
                              ))}
                            </div>
                            <div className="mt-2 relative">
                              <button
                                type="button"
                                className={`w-full text-left py-3 px-4 rounded-md ${
                                  donationForm.amount === 'custom'
                                    ? 'bg-gold text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => setDonationForm(prev => ({ ...prev, amount: 'custom' }))}
                              >
                                Custom Amount
                              </button>
                              {donationForm.amount === 'custom' && (
                                <div className="mt-2 flex items-center">
                                  <span className="absolute ml-3 text-gray-500">£</span>
                                  <input
                                    type="number"
                                    name="customAmount"
                                    value={donationForm.customAmount}
                                    onChange={handleDonationFormChange}
                                    className="w-full pl-8 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                    placeholder="Enter amount"
                                    min="1"
                                    step="1"
                                    required={donationForm.amount === 'custom'}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Gift Frequency */}
                          <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">
                              Gift Frequency
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                type="button"
                                className={`py-3 rounded-md ${
                                  donationForm.frequency === 'one-time'
                                    ? 'bg-gold text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => setDonationForm(prev => ({ ...prev, frequency: 'one-time' }))}
                              >
                                One Time
                              </button>
                              <button
                                type="button"
                                className={`py-3 rounded-md ${
                                  donationForm.frequency === 'weekly'
                                    ? 'bg-gold text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => setDonationForm(prev => ({ ...prev, frequency: 'weekly' }))}
                              >
                                Weekly
                              </button>
                              <button
                                type="button"
                                className={`py-3 rounded-md ${
                                  donationForm.frequency === 'monthly'
                                    ? 'bg-gold text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => setDonationForm(prev => ({ ...prev, frequency: 'monthly' }))}
                              >
                                Monthly
                              </button>
                            </div>
                          </div>
                          
                          {/* Fund Type */}
                          <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="fundType">
                              Select Fund
                            </label>
                            <select
                              id="fundType"
                              name="fundType"
                              value={donationForm.fundType}
                              onChange={handleDonationFormChange}
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                            >
                              <option value="general">General Fund</option>
                              <option value="missions">Missions Fund</option>
                              <option value="building">Building Fund</option>
                              <option value="youth">Youth Ministry</option>
                              <option value="outreach">Community Outreach</option>
                            </select>
                          </div>
                          
                          {/* Contact Information */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Contact Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-gray-700 mb-1" htmlFor="firstName">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  id="firstName"
                                  name="firstName"
                                  value={donationForm.firstName}
                                  onChange={handleDonationFormChange}
                                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 mb-1" htmlFor="lastName">
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  id="lastName"
                                  name="lastName"
                                  value={donationForm.lastName}
                                  onChange={handleDonationFormChange}
                                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-gray-700 mb-1" htmlFor="email">
                                Email Address
                              </label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={donationForm.email}
                                onChange={handleDonationFormChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Your receipt will be emailed to this address
                              </p>
                            </div>
                          </div>
                          
                          {/* Payment Information */}
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Payment Information</h3>
                            <div className="mb-4">
                              <label className="block text-gray-700 mb-2">Payment Method</label>
                              <div className="grid grid-cols-3 gap-3">
                                <button
                                  type="button"
                                  className={`px-4 py-3 rounded-md flex items-center justify-center ${
                                    donationForm.paymentMethod === 'card'
                                      ? 'bg-gold text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                  onClick={() => setDonationForm(prev => ({ ...prev, paymentMethod: 'card' }))}
                                >
                                  <i className="far fa-credit-card mr-2"></i> Credit Card
                                </button>
                                <button
                                  type="button"
                                  className={`px-4 py-3 rounded-md flex items-center justify-center ${
                                    donationForm.paymentMethod === 'paypal'
                                      ? 'bg-gold text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                  onClick={() => setDonationForm(prev => ({ ...prev, paymentMethod: 'paypal' }))}
                                >
                                  <i className="fab fa-paypal mr-2"></i> PayPal
                                </button>
                                <button
                                  type="button"
                                  className={`px-4 py-3 rounded-md flex items-center justify-center ${
                                    donationForm.paymentMethod === 'googlepay'
                                      ? 'bg-gold text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                  onClick={() => setDonationForm(prev => ({ ...prev, paymentMethod: 'googlepay' }))}
                                >
                                  <i className="fab fa-google-pay mr-2"></i> Google Pay
                                </button>
                              </div>
                            </div>
                            
                            {donationForm.paymentMethod === 'card' && (
                              <div>
                                <div className="mb-4">
                                  <label className="block text-gray-700 mb-1" htmlFor="cardNumber">
                                    Card Number
                                  </label>
                                  <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={donationForm.cardNumber}
                                    onChange={handleDonationFormChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                    placeholder="0000 0000 0000 0000"
                                    required={donationForm.paymentMethod === 'card'}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-gray-700 mb-1" htmlFor="expiryDate">
                                      Expiry Date
                                    </label>
                                    <input
                                      type="text"
                                      id="expiryDate"
                                      name="expiryDate"
                                      value={donationForm.expiryDate}
                                      onChange={handleDonationFormChange}
                                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                      placeholder="MM/YY"
                                      required={donationForm.paymentMethod === 'card'}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-gray-700 mb-1" htmlFor="cvv">
                                      CVV
                                    </label>
                                    <input
                                      type="text"
                                      id="cvv"
                                      name="cvv"
                                      value={donationForm.cvv}
                                      onChange={handleDonationFormChange}
                                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                                      placeholder="000"
                                      required={donationForm.paymentMethod === 'card'}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {donationForm.paymentMethod === 'paypal' && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                                  <i className="fab fa-paypal text-white text-3xl"></i>
                                </div>
                                <h4 className="text-lg font-semibold text-blue-900 mb-2">Pay with PayPal</h4>
                                <p className="text-blue-700 text-sm mb-4">
                                  You will be redirected to PayPal to complete your secure donation.
                                </p>
                                <div className="flex items-center justify-center space-x-2 text-xs text-blue-600">
                                  <i className="fas fa-lock"></i>
                                  <span>Secure PayPal checkout</span>
                                </div>
                              </div>
                            )}

                            {donationForm.paymentMethod === 'googlepay' && (
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-md">
                                  <i className="fab fa-google-pay text-gray-800 text-3xl"></i>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Pay with Google Pay</h4>
                                <p className="text-gray-600 text-sm mb-4">
                                  Use your saved payment methods for a fast and secure donation.
                                </p>
                                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                                  <i className="fas fa-shield-alt"></i>
                                  <span>Protected by Google</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-4">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="savePaymentInfo"
                                  checked={donationForm.savePaymentInfo}
                                  onChange={handleDonationFormChange}
                                  className="mr-2 h-5 w-5"
                                />
                                <span className="text-sm">Save my payment information for future donations</span>
                              </label>
                            </div>
                          </div>
                          
                          <button type="submit" className="btn-primary w-full text-lg py-4">
                            {donationForm.frequency === 'one-time' 
                              ? `Donate ${donationForm.amount === 'custom' ? `£${donationForm.customAmount || '0'}` : `£${donationForm.amount}`}` 
                              : `Give ${donationForm.amount === 'custom' ? `£${donationForm.customAmount || '0'}` : `£${donationForm.amount}`} ${donationForm.frequency}`}
                          </button>
                          
                          <p className="text-center text-sm text-gray-500 mt-4">
                            Your donation is secure and encrypted. You'll receive a receipt via email.
                          </p>
                        </form>
                      </>
                    )}
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
