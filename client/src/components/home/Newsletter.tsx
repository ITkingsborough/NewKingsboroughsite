import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { NewsletterFormData } from '@/lib/types';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email')
});

const Newsletter = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: ''
    }
  });

  const newsletterMutation = useMutation({
    mutationFn: async (data: NewsletterFormData) => {
      const response = await apiRequest('POST', '/api/newsletter', data);
      return response.json();
    },
    onSuccess: () => {
      reset();
      window.alert('Thank you for subscribing to our newsletter!');
    },
    onError: (error) => {
      console.error('Error subscribing to newsletter:', error);
      window.alert('There was an error subscribing to the newsletter. Please try again.');
    }
  });

  const onSubmit = (data: NewsletterFormData) => {
    newsletterMutation.mutate(data);
  };

  return (
    <section className="py-16 bg-lilac bg-opacity-10">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <h2 className="text-3xl font-montserrat font-bold mb-4 text-white">
            Stay Connected
          </h2>
          <p className="text-lg mb-8 text-white">
            Subscribe to our newsletter for updates, devotionals, and church news.
          </p>
          <form 
            className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex-grow">
              <input 
                type="email" 
                placeholder="Your email address" 
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold`}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.email.message}</p>
              )}
            </div>
            <button 
              type="submit" 
              className="btn-primary whitespace-nowrap"
              disabled={newsletterMutation.isPending}
            >
              {newsletterMutation.isPending ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
