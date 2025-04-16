import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertNewsletterSchema,
  insertSermonSchema,
  insertEventSchema,
  insertGalleryItemSchema,
  insertMagazineSchema,
  insertActivityLogSchema
} from "@shared/schema";
import { setupAuth, logUserActivity } from "./auth";
import { uploadMiddleware, getPublicUrl, deleteFile } from "./uploadService";
import path from "path";

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

  // CMS API Routes
  // All CMS routes are protected by authentication middleware in auth.ts

  // Contact Message Management
  app.get('/api/cms/contacts', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const messages = await storage.getAllContactMessages();
      return res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch contact messages'
      });
    }
  });

  app.get('/api/cms/contacts/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const id = parseInt(req.params.id, 10);
      const message = await storage.getContactMessage(id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Contact message not found'
        });
      }
      
      return res.json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error fetching contact message:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch contact message'
      });
    }
  });

  app.delete('/api/cms/contacts/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const id = parseInt(req.params.id, 10);
      const message = await storage.getContactMessage(id);
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Contact message not found'
        });
      }
      
      await storage.deleteContactMessage(id);
      await logUserActivity(req.user.id, "delete", "contact", id);
      
      return res.json({
        success: true,
        message: 'Contact message deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting contact message:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete contact message'
      });
    }
  });

  // Sermon Management
  app.get('/api/cms/sermons', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const sermons = await storage.getAllSermons();
      return res.json({
        success: true,
        data: sermons
      });
    } catch (error) {
      console.error('Error fetching sermons:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sermons'
      });
    }
  });

  app.get('/api/cms/sermons/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const id = parseInt(req.params.id, 10);
      const sermon = await storage.getSermon(id);
      
      if (!sermon) {
        return res.status(404).json({
          success: false,
          message: 'Sermon not found'
        });
      }
      
      return res.json({
        success: true,
        data: sermon
      });
    } catch (error) {
      console.error('Error fetching sermon:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sermon'
      });
    }
  });

  app.post('/api/cms/sermons', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has editor or admin role
      if (req.user.role !== 'admin' && req.user.role !== 'editor') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to create sermons'
        });
      }
      
      const validatedData = insertSermonSchema.parse({
        ...req.body,
        createdBy: req.user.id,
        updatedBy: req.user.id
      });
      
      const sermon = await storage.createSermon(validatedData);
      await logUserActivity(req.user.id, "create", "sermon", sermon.id);
      
      return res.status(201).json({
        success: true,
        message: 'Sermon created successfully',
        data: sermon
      });
    } catch (error) {
      console.error('Error creating sermon:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create sermon'
      });
    }
  });

  app.put('/api/cms/sermons/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has editor or admin role
      if (req.user.role !== 'admin' && req.user.role !== 'editor') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update sermons'
        });
      }
      
      const id = parseInt(req.params.id, 10);
      const sermon = await storage.getSermon(id);
      
      if (!sermon) {
        return res.status(404).json({
          success: false,
          message: 'Sermon not found'
        });
      }
      
      const validatedData = insertSermonSchema.partial().parse({
        ...req.body,
        updatedBy: req.user.id
      });
      
      const updatedSermon = await storage.updateSermon(id, validatedData);
      await logUserActivity(req.user.id, "update", "sermon", id);
      
      return res.json({
        success: true,
        message: 'Sermon updated successfully',
        data: updatedSermon
      });
    } catch (error) {
      console.error('Error updating sermon:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update sermon'
      });
    }
  });

  app.delete('/api/cms/sermons/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete sermons'
        });
      }
      
      const id = parseInt(req.params.id, 10);
      const sermon = await storage.getSermon(id);
      
      if (!sermon) {
        return res.status(404).json({
          success: false,
          message: 'Sermon not found'
        });
      }
      
      await storage.deleteSermon(id);
      await logUserActivity(req.user.id, "delete", "sermon", id);
      
      return res.json({
        success: true,
        message: 'Sermon deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting sermon:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete sermon'
      });
    }
  });

  // Event Management
  app.get('/api/cms/events', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const events = await storage.getAllEvents();
      return res.json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch events'
      });
    }
  });

  app.get('/api/cms/events/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const id = parseInt(req.params.id, 10);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      
      return res.json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch event'
      });
    }
  });

  app.post('/api/cms/events', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has editor or admin role
      if (req.user.role !== 'admin' && req.user.role !== 'editor') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to create events'
        });
      }
      
      const validatedData = insertEventSchema.parse({
        ...req.body,
        createdBy: req.user.id,
        updatedBy: req.user.id
      });
      
      const event = await storage.createEvent(validatedData);
      await logUserActivity(req.user.id, "create", "event", event.id);
      
      return res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event
      });
    } catch (error) {
      console.error('Error creating event:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create event'
      });
    }
  });

  app.put('/api/cms/events/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has editor or admin role
      if (req.user.role !== 'admin' && req.user.role !== 'editor') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update events'
        });
      }
      
      const id = parseInt(req.params.id, 10);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      
      const validatedData = insertEventSchema.partial().parse({
        ...req.body,
        updatedBy: req.user.id
      });
      
      const updatedEvent = await storage.updateEvent(id, validatedData);
      await logUserActivity(req.user.id, "update", "event", id);
      
      return res.json({
        success: true,
        message: 'Event updated successfully',
        data: updatedEvent
      });
    } catch (error) {
      console.error('Error updating event:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update event'
      });
    }
  });

  app.delete('/api/cms/events/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete events'
        });
      }
      
      const id = parseInt(req.params.id, 10);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      
      await storage.deleteEvent(id);
      await logUserActivity(req.user.id, "delete", "event", id);
      
      return res.json({
        success: true,
        message: 'Event deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete event'
      });
    }
  });

  // Gallery Management
  app.get('/api/cms/gallery', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const galleryItems = await storage.getAllGalleryItems();
      return res.json({
        success: true,
        data: galleryItems
      });
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch gallery items'
      });
    }
  });

  app.get('/api/cms/gallery/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const id = parseInt(req.params.id, 10);
      const galleryItem = await storage.getGalleryItem(id);
      
      if (!galleryItem) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found'
        });
      }
      
      return res.json({
        success: true,
        data: galleryItem
      });
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch gallery item'
      });
    }
  });

  app.post('/api/cms/gallery', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has media_manager or admin role
      if (req.user.role !== 'admin' && req.user.role !== 'media_manager') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to create gallery items'
        });
      }
      
      const validatedData = insertGalleryItemSchema.parse({
        ...req.body,
        createdBy: req.user.id,
        updatedBy: req.user.id
      });
      
      const galleryItem = await storage.createGalleryItem(validatedData);
      await logUserActivity(req.user.id, "create", "gallery", galleryItem.id);
      
      return res.status(201).json({
        success: true,
        message: 'Gallery item created successfully',
        data: galleryItem
      });
    } catch (error) {
      console.error('Error creating gallery item:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create gallery item'
      });
    }
  });

  app.put('/api/cms/gallery/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has media_manager or admin role
      if (req.user.role !== 'admin' && req.user.role !== 'media_manager') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update gallery items'
        });
      }
      
      const id = parseInt(req.params.id, 10);
      const galleryItem = await storage.getGalleryItem(id);
      
      if (!galleryItem) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found'
        });
      }
      
      const validatedData = insertGalleryItemSchema.partial().parse({
        ...req.body,
        updatedBy: req.user.id
      });
      
      const updatedGalleryItem = await storage.updateGalleryItem(id, validatedData);
      await logUserActivity(req.user.id, "update", "gallery", id);
      
      return res.json({
        success: true,
        message: 'Gallery item updated successfully',
        data: updatedGalleryItem
      });
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update gallery item'
      });
    }
  });

  app.delete('/api/cms/gallery/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has admin role
      if (req.user.role !== 'admin' && req.user.role !== 'media_manager') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete gallery items'
        });
      }
      
      const id = parseInt(req.params.id, 10);
      const galleryItem = await storage.getGalleryItem(id);
      
      if (!galleryItem) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found'
        });
      }
      
      await storage.deleteGalleryItem(id);
      await logUserActivity(req.user.id, "delete", "gallery", id);
      
      return res.json({
        success: true,
        message: 'Gallery item deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete gallery item'
      });
    }
  });

  // Public API Endpoints
  app.get('/api/sermons', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      let sermons;
      
      if (category) {
        sermons = await storage.getSermonsByCategory(category);
      } else {
        sermons = await storage.getAllSermons();
      }
      
      return res.json({
        success: true,
        data: sermons
      });
    } catch (error) {
      console.error('Error fetching sermons:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sermons'
      });
    }
  });

  app.get('/api/sermons/featured', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const sermons = await storage.getFeaturedSermons(limit);
      
      return res.json({
        success: true,
        data: sermons
      });
    } catch (error) {
      console.error('Error fetching featured sermons:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch featured sermons'
      });
    }
  });

  app.get('/api/sermons/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const sermon = await storage.getSermon(id);
      
      if (!sermon) {
        return res.status(404).json({
          success: false,
          message: 'Sermon not found'
        });
      }
      
      return res.json({
        success: true,
        data: sermon
      });
    } catch (error) {
      console.error('Error fetching sermon:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sermon'
      });
    }
  });

  app.get('/api/events', async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      
      return res.json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch events'
      });
    }
  });

  app.get('/api/events/upcoming', async (req, res) => {
    try {
      const events = await storage.getFutureEvents();
      
      return res.json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming events'
      });
    }
  });

  app.get('/api/events/featured', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const events = await storage.getFeaturedEvents(limit);
      
      return res.json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('Error fetching featured events:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch featured events'
      });
    }
  });

  app.get('/api/events/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      
      return res.json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch event'
      });
    }
  });

  app.get('/api/gallery', async (req, res) => {
    try {
      const tag = req.query.tag as string | undefined;
      let galleryItems;
      
      if (tag) {
        galleryItems = await storage.getGalleryItemsByTag(tag);
      } else {
        galleryItems = await storage.getAllGalleryItems();
      }
      
      return res.json({
        success: true,
        data: galleryItems
      });
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch gallery items'
      });
    }
  });

  app.get('/api/gallery/featured', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const galleryItems = await storage.getFeaturedGalleryItems(limit);
      
      return res.json({
        success: true,
        data: galleryItems
      });
    } catch (error) {
      console.error('Error fetching featured gallery items:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch featured gallery items'
      });
    }
  });

  app.get('/api/gallery/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const galleryItem = await storage.getGalleryItem(id);
      
      if (!galleryItem) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found'
        });
      }
      
      return res.json({
        success: true,
        data: galleryItem
      });
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch gallery item'
      });
    }
  });

  // File Upload endpoints
  app.post('/api/upload', uploadMiddleware.single('file'), async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      // Get file information
      const uploadType = req.body.uploadType || 'gallery';
      const fileUrl = getPublicUrl(req.file.filename, uploadType);
      
      // Log the activity
      await logUserActivity(req.user.id, "upload", uploadType, undefined, JSON.stringify({
        filename: req.file.filename,
        fileUrl: fileUrl,
        size: req.file.size
      }));

      return res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          filename: req.file.filename,
          fileUrl: fileUrl,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file',
        error: error.message || String(error)
      });
    }
  });

  // Magazine endpoints
  app.get('/api/cms/magazines', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const magazines = await storage.getAllMagazines();
      return res.json({
        success: true,
        data: magazines
      });
    } catch (error) {
      console.error('Error fetching magazines:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch magazines'
      });
    }
  });

  app.get('/api/cms/magazines/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      const id = parseInt(req.params.id, 10);
      const magazine = await storage.getMagazine(id);
      
      if (!magazine) {
        return res.status(404).json({
          success: false,
          message: 'Magazine not found'
        });
      }
      
      return res.json({
        success: true,
        data: magazine
      });
    } catch (error) {
      console.error('Error fetching magazine:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch magazine'
      });
    }
  });

  app.post('/api/cms/magazines', uploadMiddleware.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
  ]), async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has editor or admin role
      if (req.user.role !== 'admin' && req.user.role !== 'editor' && req.user.role !== 'media_manager') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to create magazines'
        });
      }
      
      console.log('Files received:', req.files);
      console.log('Body received:', req.body);
      
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } || {};
      
      if (!files || !files.coverImage || files.coverImage.length === 0 || !files.pdfFile || files.pdfFile.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Both cover image and PDF file are required'
        });
      }
      
      const coverImageUrl = getPublicUrl(files.coverImage[0].filename, 'magazines');
      const pdfUrl = getPublicUrl(files.pdfFile[0].filename, 'magazines');
      
      const magazineData = {
        ...req.body,
        coverImage: coverImageUrl,
        pdfUrl: pdfUrl,
        createdBy: req.user.id,
        updatedBy: req.user.id
      };
      
      const validatedData = insertMagazineSchema.parse(magazineData);
      const magazine = await storage.createMagazine(validatedData);
      await logUserActivity(req.user.id, "create", "magazine", magazine.id);
      
      return res.status(201).json({
        success: true,
        message: 'Magazine created successfully',
        data: magazine
      });
    } catch (error: any) {
      console.error('Error creating magazine:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create magazine',
        error: error.message || String(error)
      });
    }
  });

  app.put('/api/cms/magazines/:id', uploadMiddleware.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
  ]), async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has editor or admin role
      if (req.user.role !== 'admin' && req.user.role !== 'editor' && req.user.role !== 'media_manager') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to update magazines'
        });
      }
      
      const id = parseInt(req.params.id, 10);
      const magazine = await storage.getMagazine(id);
      
      if (!magazine) {
        return res.status(404).json({
          success: false,
          message: 'Magazine not found'
        });
      }
      
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } || {};
      const updateData: any = { ...req.body, updatedBy: req.user.id };
      
      // Update cover image if uploaded
      if (files.coverImage && files.coverImage.length > 0) {
        // Delete old cover image if it exists
        if (magazine.coverImage) {
          await deleteFile(magazine.coverImage);
        }
        updateData.coverImage = getPublicUrl(files.coverImage[0].filename, 'magazines');
      }
      
      // Update PDF file if uploaded
      if (files.pdfFile && files.pdfFile.length > 0) {
        // Delete old PDF file if it exists
        if (magazine.pdfUrl) {
          await deleteFile(magazine.pdfUrl);
        }
        updateData.pdfUrl = getPublicUrl(files.pdfFile[0].filename, 'magazines');
      }
      
      const validatedData = insertMagazineSchema.partial().parse(updateData);
      const updatedMagazine = await storage.updateMagazine(id, validatedData);
      await logUserActivity(req.user.id, "update", "magazine", id);
      
      return res.json({
        success: true,
        message: 'Magazine updated successfully',
        data: updatedMagazine
      });
    } catch (error: any) {
      console.error('Error updating magazine:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update magazine',
        error: error.message || String(error)
      });
    }
  });

  app.delete('/api/cms/magazines/:id', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Check if user has admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete magazines'
        });
      }
      
      const id = parseInt(req.params.id, 10);
      const magazine = await storage.getMagazine(id);
      
      if (!magazine) {
        return res.status(404).json({
          success: false,
          message: 'Magazine not found'
        });
      }
      
      // Delete associated files
      if (magazine.coverImage) {
        await deleteFile(magazine.coverImage);
      }
      
      if (magazine.pdfUrl) {
        await deleteFile(magazine.pdfUrl);
      }
      
      await storage.deleteMagazine(id);
      await logUserActivity(req.user.id, "delete", "magazine", id);
      
      return res.json({
        success: true,
        message: 'Magazine deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting magazine:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete magazine'
      });
    }
  });

  // Public magazine endpoints
  app.get('/api/magazines', async (req, res) => {
    try {
      const magazines = await storage.getAllMagazines();
      return res.json({
        success: true,
        data: magazines
      });
    } catch (error) {
      console.error('Error fetching magazines:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch magazines'
      });
    }
  });

  app.get('/api/magazines/featured', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const magazines = await storage.getFeaturedMagazines(limit);
      return res.json({
        success: true,
        data: magazines
      });
    } catch (error) {
      console.error('Error fetching featured magazines:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch featured magazines'
      });
    }
  });

  app.get('/api/magazines/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const magazine = await storage.getMagazine(id);
      
      if (!magazine) {
        return res.status(404).json({
          success: false,
          message: 'Magazine not found'
        });
      }
      
      return res.json({
        success: true,
        data: magazine
      });
    } catch (error) {
      console.error('Error fetching magazine:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch magazine'
      });
    }
  });

  // Configure Express to serve static files from the public folder
  app.use('/uploads', (req, res, next) => {
    // Make sure the file being accessed is from the uploads directory
    if (!req.url.startsWith('/')) {
      return res.status(404).send('Not found');
    }
    next();
  }, express.static(path.join(process.cwd(), 'public', 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}
