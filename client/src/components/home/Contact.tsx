import { useState } from 'react';
import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ContactFormData } from '@/lib/types';

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
      window.alert('Your message has been sent successfully!');
    },
    onError: (error) => {
      console.error('Error submitting form:', error);
      window.alert('There was an error sending your message. Please try again.');
    }
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start">
          <motion.div 
            className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
          >
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
              Contact Us
            </h2>
            <p className="text-lg mb-8">
              We'd love to hear from you! Reach out with any questions or prayer requests, or visit us at our service times.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <i className="fas fa-map-marker-alt text-gold text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-montserrat font-semibold mb-1">Visit Us</h3>
                  <p>215 High Street, Yiewsley<br />West Drayton, UB7 7QP</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <i className="fas fa-clock text-gold text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-montserrat font-semibold mb-1">Service Times</h3>
                  <p>Wednesday at 07:00 PM - 08:30 PM</p>
                  <p>Bible Study on Sunday at 9:15 PM</p>
                  <p>Sundays at 10:00 AM - 12:00 PM</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <i className="fas fa-phone text-gold text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-montserrat font-semibold mb-1">Call Us</h3>
                  <p>01895252224 or 07848237072 (Monday to Friday) </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <i className="fas fa-envelope text-gold text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-montserrat font-semibold mb-1">Email Us</h3>
                  <p>info@kingsboroughchurch.org</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-montserrat font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/kingsboroughuk/?locale=en_GB" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a 
                  href="https://www.instagram.com/kingsboroughuk/?hl=en-gb" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a 
                  href="https://www.youtube.com/@KingsboroughLiveTv" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-300"
                  aria-label="YouTube"
                >
                  <i className="fab fa-youtube"></i>
                </a>
                <a 
                  href="https://spotify.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-300"
                  aria-label="Spotify"
                >
                  <i className="fab fa-spotify"></i>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-montserrat font-semibold mb-4">Map</h3>
              <div className="h-64 bg-gray-200 rounded-lg overflow-hidden relative">
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
          
          <motion.div 
            className="lg:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp(0.3)}
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-montserrat font-semibold mb-6">Send Us a Message</h3>
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
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
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
                <div className="mb-6">
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
