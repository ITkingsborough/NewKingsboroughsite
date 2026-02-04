import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ContactFormData } from '@/lib/types';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  isPrayer: z.boolean().default(false)
});

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      isPrayer: false
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
      reset();
      setFormSubmitted(true);
    },
    onError: (error) => {
      console.error('Error submitting form:', error);
      setFormError('There was an error sending your message. Please try again.');
    }
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("contact");

  const onSubmit = (data: ContactFormData) => {
    setFormError(null);
    contactMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Kingsborough Church</title>
        <meta name="description" content="Connect with Kingsborough Church. Reach out with questions, prayer requests, or to learn more about our community." />
      </Helmet>
      <div className="pt-24">
        {/* Hero Section */}
        <section data-nav-theme="dark" className="relative h-80 md:h-96 flex items-center parallax" style={{ backgroundImage: `url('/uploads/gallery/IMG_1177.JPG')` }}>
          <div className="absolute inset-0 overlay-lilac"></div>
          <div className="container mx-auto px-4 lg:px-8 z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp()}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4 tracking-tight text-shadow">Contact Us</h1>
              <p className="text-xl text-white opacity-90 font-light">
                We'd love to hear from you. Reach out with any questions or prayer requests.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-12">
              {/* Left Column - Contact Information */}
              <motion.div 
                className="lg:w-1/2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
              >
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-8 text-deepPurple">
                  Get In Touch
                </h2>
                
                <div className="space-y-8 mb-12">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-map-marker-alt text-gold text-xl"></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-semibold mb-2">Visit Us</h3>
                      <p className="mb-1">215 High Street, Yiewsley</p>
                      <p>West Drayton, UB7 7QP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-clock text-gold text-xl"></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-semibold mb-2">Service Times</h3>
                      <p className="mb-1"><strong>Sunday Services:</strong> 10:00 AM - 12:00 PM</p>
                      <p><strong>Wednesday Bible Study:</strong> 7:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-phone text-gold text-xl"></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-semibold mb-2">Call Us</h3>
                      <p className="mb-1">01895252224</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center">
                        <i className="fas fa-envelope text-gold text-xl"></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-semibold mb-2">Email Us</h3>
                      <p className="mb-1">info@kingsboroughchurch.org</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-12">
                  <h3 className="text-xl font-montserrat font-semibold mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-300"
                      aria-label="Facebook"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-300"
                      aria-label="Instagram"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a 
                      href="https://youtube.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-300"
                      aria-label="YouTube"
                    >
                      <i className="fab fa-youtube"></i>
                    </a>
                    <a 
                      href="https://spotify.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-300"
                      aria-label="Spotify"
                    >
                      <i className="fab fa-spotify"></i>
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-montserrat font-semibold mb-4">Location Map</h3>
                  <div className="h-80 bg-gray-100 rounded-lg overflow-hidden relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.5!2d-0.4716!3d51.5127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48766f0a0a0a0a0a%3A0x0!2s215%20High%20Street%2C%20Yiewsley%2C%20West%20Drayton%20UB7%207QP%2C%20UK!5e0!3m2!1sen!2suk!4v1620151853093!5m2!1sen!2suk"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      title="Kingsborough Church Location Map"
                    ></iframe>
                  </div>
                </div>
              </motion.div>
              
              {/* Right Column - Contact Form */}
              <motion.div 
                className="lg:w-1/2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.3)}
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-0 rounded-none">
                      <TabsTrigger value="contact" className="text-lg py-4 data-[state=active]:bg-gold data-[state=active]:text-white rounded-none data-[state=inactive]:bg-gray-100">
                        Contact Message
                      </TabsTrigger>
                      <TabsTrigger value="prayer" className="text-lg py-4 data-[state=active]:bg-gold data-[state=active]:text-white rounded-none data-[state=inactive]:bg-gray-100">
                        Prayer Request
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="contact" className="p-8">
                      {formSubmitted ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check text-2xl"></i>
                          </div>
                          <h3 className="text-2xl font-montserrat font-semibold mb-4">Message Sent!</h3>
                          <p className="mb-6">
                            Thank you for reaching out to us. We've received your message and will respond to you shortly.
                          </p>
                          <button 
                            onClick={() => {
                              setFormSubmitted(false);
                              reset();
                            }}
                            className="btn-outline"
                          >
                            Send Another Message
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-2xl font-montserrat font-semibold mb-6">Send Us a Message</h3>
                          
                          {formError && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                              <p>{formError}</p>
                            </div>
                          )}
                          
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-6">
                              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                              <input 
                                type="text" 
                                id="name"
                                {...register('name')}
                                className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold`}
                              />
                              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>
                            <div className="mb-6">
                              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                              <input 
                                type="email" 
                                id="email"
                                {...register('email')}
                                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold`}
                              />
                              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>
                            <div className="mb-6">
                              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number (Optional)</label>
                              <input 
                                type="tel" 
                                id="phone"
                                {...register('phone')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                              />
                            </div>
                            <div className="mb-6">
                              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                              <textarea 
                                id="message"
                                rows={5}
                                {...register('message')}
                                className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold`}
                              ></textarea>
                              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                            </div>
                            <div className="mb-6 hidden">
                              <div className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  id="isPrayer"
                                  {...register('isPrayer')}
                                  className="mr-2 h-5 w-5"
                                />
                                <label htmlFor="isPrayer" className="text-gray-700">This is a prayer request</label>
                              </div>
                            </div>
                            <button 
                              type="submit" 
                              className="btn-primary w-full"
                              disabled={contactMutation.isPending}
                            >
                              {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                            </button>
                          </form>
                        </>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="prayer" className="p-8">
                      {formSubmitted ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check text-2xl"></i>
                          </div>
                          <h3 className="text-2xl font-montserrat font-semibold mb-4">Prayer Request Received</h3>
                          <p className="mb-6">
                            Your prayer request has been submitted. Our prayer team will begin praying for you.
                          </p>
                          <button 
                            onClick={() => {
                              setFormSubmitted(false);
                              reset();
                            }}
                            className="btn-outline"
                          >
                            Submit Another Request
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-2xl font-montserrat font-semibold mb-6">Submit a Prayer Request</h3>
                          
                          {formError && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                              <p>{formError}</p>
                            </div>
                          )}
                          
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-6">
                              <label htmlFor="prayer-name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                              <input 
                                type="text" 
                                id="prayer-name"
                                {...register('name')}
                                className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold`}
                              />
                              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>
                            <div className="mb-6">
                              <label htmlFor="prayer-email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                              <input 
                                type="email" 
                                id="prayer-email"
                                {...register('email')}
                                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold`}
                              />
                              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>
                            <div className="mb-6">
                              <label htmlFor="prayer-phone" className="block text-gray-700 font-medium mb-2">Phone Number (Optional)</label>
                              <input 
                                type="tel" 
                                id="prayer-phone"
                                {...register('phone')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                              />
                            </div>
                            <div className="mb-6">
                              <label htmlFor="prayer-message" className="block text-gray-700 font-medium mb-2">Prayer Request</label>
                              <textarea 
                                id="prayer-message"
                                rows={5}
                                {...register('message')}
                                className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold`}
                                placeholder="Share your prayer request. This will be kept confidential within our prayer team."
                              ></textarea>
                              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                            </div>
                            <div className="mb-6 hidden">
                              <input 
                                type="checkbox" 
                                id="prayer-isPrayer"
                                {...register('isPrayer')}
                                checked
                                readOnly
                              />
                            </div>
                            <button 
                              type="submit" 
                              className="btn-primary w-full"
                              disabled={contactMutation.isPending}
                              onClick={() => {
                                // Set the prayer checkbox to true when using the prayer tab
                                const hiddenPrayerCheckbox = document.getElementById('prayer-isPrayer') as HTMLInputElement;
                                if (hiddenPrayerCheckbox) {
                                  hiddenPrayerCheckbox.checked = true;
                                }
                              }}
                            >
                              {contactMutation.isPending ? 'Submitting...' : 'Submit Prayer Request'}
                            </button>
                          </form>
                        </>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Additional Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-deepPurple p-6 rounded-lg">
                    <h3 className="text-lg font-montserrat font-semibold mb-3 text-white">Join a Small Group</h3>
                    <p className="mb-4 text-white">Connect with others in a small group setting for fellowship and growth.</p>
                    <a href="#" className="text-gold font-montserrat font-medium hover:underline inline-flex items-center">
                      Find a Group <i className="fas fa-arrow-right ml-2 text-sm"></i>
                    </a>
                  </div>
                  <div className="bg-deepPurple p-6 rounded-lg">
                    <h3 className="text-lg font-montserrat font-semibold mb-3 text-white">Volunteer Opportunities</h3>
                    <p className="mb-4 text-white">Discover ways to serve and make a difference in our church and community.</p>
                    <a href="#" className="text-gold font-montserrat font-medium hover:underline inline-flex items-center">
                      Get Involved <i className="fas fa-arrow-right ml-2 text-sm"></i>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <h2 className="text-3xl font-montserrat font-bold mb-4 text-deepPurple">Frequently Asked Questions</h2>
              <p className="text-lg max-w-3xl mx-auto">
                Find answers to common questions about visiting and getting involved at Kingsborough Church.
              </p>
            </motion.div>
            
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={slideUp(0.2)}
            >
              <div className="space-y-5">
                {[
                  {
                    question: "What time are your Sunday services?",
                    answer: "Our Sunday services at 10:00 AM - 12:00 PM. Both services include worship and teaching. Children's ministry is available at both services for kids from birth through 5th grade."
                  },
                  {
                    question: "Where should I park when I visit?",
                    answer: "We have a large parking lot with plenty of spaces. When you arrive, our parking team will direct you to the nearest available spot. We have reserved parking near the entrance for first-time visitors and those with accessibility needs."
                  },
                  {
                    question: "What should I wear to church?",
                    answer: "Come as you are! You'll see people dressed in everything from casual jeans to business casual attire. We care more about you being here than what you wear."
                  },
                  {
                    question: "What programs do you offer for children?",
                    answer: "We have age-appropriate programs for children from birth through 5th grade during our Sunday services. Our secure check-in process ensures your child's safety, and our dedicated volunteers create an engaging environment where kids can learn about God's love."
                  },
                  {
                    question: "How can I join a small group?",
                    answer: "Small groups are a great way to build relationships and grow spiritually. You can browse available groups on our website, or visit the Welcome Center on Sunday morning where a team member can help you find a group that fits your schedule and interests."
                  }
                ].map((faq, index) => (
                  <div 
                    key={index} 
                    className="bg-deepPurple rounded-lg p-6"
                  >
                    <h3 className="text-lg font-montserrat font-semibold mb-3 text-white">{faq.question}</h3>
                    <p className="text-white">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-10">
                <p className="mb-4">Still have questions? We're here to help!</p>
                <a href="#" className="btn-primary">
                  Ask a Question
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
