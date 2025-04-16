import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API routes
  const apiRouter = app.route('/api');
  
  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const result = await storage.createContactMessage(validatedData);
      
      return res.status(201).json({
        success: true,
        message: 'Contact message submitted successfully',
        data: result
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid contact form data'
      });
    }
  });
  
  // Newsletter subscription
  app.post('/api/newsletter', async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      
      // Check if email already exists
      const subscribers = await storage.getAllNewsletterSubscribers();
      const existingSubscriber = subscribers.find(sub => sub.email === validatedData.email);
      
      if (existingSubscriber) {
        return res.status(200).json({
          success: true,
          message: 'Email already subscribed',
          data: existingSubscriber
        });
      }
      
      const result = await storage.createNewsletterSubscriber(validatedData);
      
      return res.status(201).json({
        success: true,
        message: 'Subscribed to newsletter successfully',
        data: result
      });
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid newsletter subscription data'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
