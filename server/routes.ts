import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { 
  insertContactSchema, 
  insertNewsletterSchema,
  insertSermonSchema,
  insertEventSchema,
  insertGalleryItemSchema,
  insertMagazineSchema,
  insertActivityLogSchema,
  insertMemberSchema,
  insertAttendanceSchema,
  insertMinistryGroupSchema,
  insertMinistryGroupMemberSchema
} from "@shared/schema";
import { setupAuth, logUserActivity, requireAuth } from "./auth";
import { uploadMiddleware, getPublicUrl, deleteFile } from "./uploadService";
import path from "path";
import { getLatestVideos, getVideoDetails, findChannel } from "./youtubeService";

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

  // First, handle file uploads separately
  app.post('/api/upload/magazine-cover', (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const upload = multer({
      storage: multer.diskStorage({
        destination: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
          cb(null, path.join(process.cwd(), 'public', 'uploads', 'magazines'));
        },
        filename: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
          const extension = path.extname(file.originalname);
          const filename = `${uuidv4()}${extension}`;
          cb(null, filename);
        }
      }),
      fileFilter: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'));
        }
      }
    }).single('coverImage');
    
    upload(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file uploaded' });
      }
      
      const filePath = `/uploads/magazines/${req.file.filename}`;
      
      return res.json({
        success: true,
        filePath: filePath
      });
    });
  });
  
  app.post('/api/upload/magazine-pdf', (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const upload = multer({
      storage: multer.diskStorage({
        destination: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
          cb(null, path.join(process.cwd(), 'public', 'uploads', 'magazines'));
        },
        filename: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
          const extension = path.extname(file.originalname);
          const filename = `${uuidv4()}${extension}`;
          cb(null, filename);
        }
      }),
      fileFilter: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed'));
        }
      }
    }).single('pdfFile');
    
    upload(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
      }
      
      const filePath = `/uploads/magazines/${req.file.filename}`;
      
      return res.json({
        success: true,
        filePath: filePath
      });
    });
  });
  
  // Then, handle magazine creation with the uploaded file paths
  app.post('/api/cms/magazines', async (req, res) => {
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
      
      console.log('Magazine data received:', req.body);
      
      // Validate required fields
      const { title, date, coverImage, pdfUrl } = req.body;
      
      if (!title || !date || !coverImage || !pdfUrl) {
        return res.status(400).json({
          success: false,
          message: 'Title, date, coverImage, and pdfUrl are required'
        });
      }
      
      const magazineData = {
        ...req.body,
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

  app.put('/api/cms/magazines/:id', async (req: Request, res: Response) => {
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
      
      console.log('Magazine update data received:', req.body);
      
      // Update data with user ID
      const updateData = {
        ...req.body,
        updatedBy: req.user.id
      };
      
      // Delete old files if new ones were uploaded
      if (updateData.coverImage && updateData.coverImage !== magazine.coverImage) {
        // Only delete if it's actually different
        if (magazine.coverImage) {
          console.log('Deleting old cover image:', magazine.coverImage);
          try {
            await deleteFile(magazine.coverImage);
          } catch (err) {
            console.error('Error deleting old cover image:', err);
          }
        }
      }
      
      if (updateData.pdfUrl && updateData.pdfUrl !== magazine.pdfUrl) {
        if (magazine.pdfUrl) {
          console.log('Deleting old PDF file:', magazine.pdfUrl);
          try {
            await deleteFile(magazine.pdfUrl);
          } catch (err) {
            console.error('Error deleting old PDF file:', err);
          }
        }
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

  // YouTube API Integration
  
  // Search for YouTube channels
  app.get('/api/youtube/channels', async (req, res) => {
    try {
      const query = req.query.q as string || 'Kingsborough Church';
      console.log(`[YouTube API] Search request for channels with query: ${query}`);
      
      const channels = await findChannel(query);
      console.log(`[YouTube API] Found ${channels.length} channels for query: ${query}`);
      
      return res.json({
        success: true,
        data: channels
      });
    } catch (error) {
      console.error('Error searching for YouTube channels:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to search for YouTube channels',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Get latest videos from YouTube channel
  app.get('/api/youtube/videos', async (req, res) => {
    try {
      // Try multiple approaches to find the correct channel
      const maxResults = parseInt(req.query.maxResults as string || '10', 10);
      const providedChannelId = req.query.channelId as string || 'KingsboroughLiveTv';
      
      console.log(`[YouTube API] Request received with channelId: ${providedChannelId}`);
      
      // First attempt - try with the provided channel ID
      try {
        console.log(`[YouTube API] Attempting with provided channel ID: ${providedChannelId}`);
        const videos = await getLatestVideos(providedChannelId, maxResults);
        if (videos && videos.length > 0) {
          console.log(`[YouTube API] Successfully fetched ${videos.length} videos with channel ID: ${providedChannelId}`);
          return res.json({
            success: true,
            data: videos
          });
        }
      } catch (e) {
        console.log(`[YouTube API] Error with provided channel ID: ${e instanceof Error ? e.message : String(e)}`);
      }
      
      // Second attempt - try with exact channel ID for KingsboroughLiveTv
      const exactChannelId = 'UCGYKC04rR0F7ajcuVQqupRQ'; // Correct channel ID found via search
      try {
        console.log(`[YouTube API] Attempting with exact channel ID: ${exactChannelId}`);
        const videos = await getLatestVideos(exactChannelId, maxResults);
        if (videos && videos.length > 0) {
          console.log(`[YouTube API] Successfully fetched ${videos.length} videos with exact channel ID`);
          return res.json({
            success: true,
            data: videos
          });
        }
      } catch (e) {
        console.log(`[YouTube API] Error with exact channel ID: ${e instanceof Error ? e.message : String(e)}`);
      }
      
      // Fallback to a known working channel as last resort (this is just for testing)
      try {
        const fallbackChannelId = 'UCpuDxVLCZ7h_JQpKqAuaOLg';
        console.log(`[YouTube API] Attempting with fallback channel ID: ${fallbackChannelId}`);
        const videos = await getLatestVideos(fallbackChannelId, maxResults);
        console.log(`[YouTube API] Fallback returned ${videos.length} videos`);
        return res.json({
          success: true,
          data: videos
        });
      } catch (e) {
        console.log(`[YouTube API] Error with fallback channel ID: ${e instanceof Error ? e.message : String(e)}`);
        throw e; // Re-throw to be caught by the outer catch
      }
      
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch YouTube videos',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Get details for a specific YouTube video
  app.get('/api/youtube/videos/:videoId', async (req, res) => {
    try {
      const videoId = req.params.videoId;
      const video = await getVideoDetails(videoId);
      
      if (!video) {
        return res.status(404).json({
          success: false,
          message: 'Video not found'
        });
      }
      
      return res.json({
        success: true,
        data: video
      });
    } catch (error) {
      console.error('Error fetching YouTube video details:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch YouTube video details',
        error: error instanceof Error ? error.message : String(error)
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

  // ==================================================================================
  // COMMUNITY ENGAGEMENT DASHBOARD API ROUTES
  // ==================================================================================

  // Member Management
  app.get('/api/community/members', requireAuth, async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      return res.json({
        success: true,
        data: members
      });
    } catch (error) {
      console.error('Error fetching members:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch members'
      });
    }
  });

  app.get('/api/community/members/recent', requireAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const members = await storage.getRecentMembers(limit);
      return res.json({
        success: true,
        data: members
      });
    } catch (error) {
      console.error('Error fetching recent members:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch recent members'
      });
    }
  });

  app.get('/api/community/members/stats', requireAuth, async (req, res) => {
    try {
      const stats = await storage.getMemberStats();
      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching member stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch member statistics'
      });
    }
  });

  app.get('/api/community/members/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const member = await storage.getMember(id);
      
      if (!member) {
        return res.status(404).json({
          success: false,
          message: 'Member not found'
        });
      }
      
      return res.json({
        success: true,
        data: member
      });
    } catch (error) {
      console.error('Error fetching member:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch member'
      });
    }
  });

  app.post('/api/community/members', requireAuth, async (req, res) => {
    try {
      const validatedData = insertMemberSchema.parse(req.body);
      
      // Check if email already exists
      const existingMember = await storage.getMemberByEmail(validatedData.email);
      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'A member with this email already exists'
        });
      }
      
      const member = await storage.createMember(validatedData);
      if (req.user) {
        await logUserActivity({
          userId: req.user.id,
          action: "create",
          entityType: "member",
          entityId: member.id,
          details: `Created new member: ${member.firstName} ${member.lastName}`,
          req
        });
      }
      
      return res.status(201).json({
        success: true,
        message: 'Member created successfully',
        data: member
      });
    } catch (error) {
      console.error('Error creating member:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create member',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.put('/api/community/members/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const member = await storage.getMember(id);
      
      if (!member) {
        return res.status(404).json({
          success: false,
          message: 'Member not found'
        });
      }
      
      const validatedData = insertMemberSchema.partial().parse(req.body);
      
      // If email is being changed, check if it already exists
      if (validatedData.email && validatedData.email !== member.email) {
        const existingMember = await storage.getMemberByEmail(validatedData.email);
        if (existingMember && existingMember.id !== id) {
          return res.status(400).json({
            success: false,
            message: 'A member with this email already exists'
          });
        }
      }
      
      const updatedMember = await storage.updateMember(id, validatedData);
      if (req.user) {
        await logUserActivity({
          userId: req.user.id,
          action: "update",
          entityType: "member",
          entityId: id,
          details: `Updated member: ${updatedMember.firstName} ${updatedMember.lastName}`,
          req
        });
      }
      
      return res.json({
        success: true,
        message: 'Member updated successfully',
        data: updatedMember
      });
    } catch (error) {
      console.error('Error updating member:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update member',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.delete('/api/community/members/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const member = await storage.getMember(id);
      
      if (!member) {
        return res.status(404).json({
          success: false,
          message: 'Member not found'
        });
      }
      
      await storage.deleteMember(id);
      if (req.user) {
        await logUserActivity({
          userId: req.user.id,
          action: "delete",
          entityType: "member",
          entityId: id,
          details: `Deleted member: ${member.firstName} ${member.lastName}`,
          req
        });
      }
      
      return res.json({
        success: true,
        message: 'Member deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete member'
      });
    }
  });

  // Attendance Management
  app.get('/api/community/attendance', requireAuth, async (req, res) => {
    try {
      const records = await storage.getAllAttendanceRecords();
      return res.json({
        success: true,
        data: records
      });
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance records'
      });
    }
  });

  app.get('/api/community/attendance/stats', requireAuth, async (req, res) => {
    try {
      const stats = await storage.getAttendanceStats();
      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance statistics'
      });
    }
  });

  app.get('/api/community/attendance/date-range', requireAuth, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }
      
      const records = await storage.getAttendanceByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      
      return res.json({
        success: true,
        data: records
      });
    } catch (error) {
      console.error('Error fetching attendance by date range:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance records'
      });
    }
  });

  app.post('/api/community/attendance', requireAuth, async (req, res) => {
    try {
      const validatedData = insertAttendanceSchema.parse(req.body);
      
      const record = await storage.createAttendanceRecord(validatedData);
      await logUserActivity({
        userId: req.user!.id,
        action: "create",
        entityType: "attendance",
        entityId: record.id,
        details: `Created attendance record for ${record.date.toISOString().split('T')[0]}`,
        req
      });
      
      return res.status(201).json({
        success: true,
        message: 'Attendance record created successfully',
        data: record
      });
    } catch (error) {
      console.error('Error creating attendance record:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create attendance record',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.put('/api/community/attendance/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const record = await storage.getAttendanceRecord(id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Attendance record not found'
        });
      }
      
      const validatedData = insertAttendanceSchema.partial().parse(req.body);
      
      const updatedRecord = await storage.updateAttendanceRecord(id, validatedData);
      await logUserActivity({
        userId: req.user!.id,
        action: "update",
        entityType: "attendance",
        entityId: id,
        details: `Updated attendance record for ${updatedRecord.date.toISOString().split('T')[0]}`,
        req
      });
      
      return res.json({
        success: true,
        message: 'Attendance record updated successfully',
        data: updatedRecord
      });
    } catch (error) {
      console.error('Error updating attendance record:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update attendance record'
      });
    }
  });

  // Ministry Groups Management
  app.get('/api/community/ministry-groups', requireAuth, async (req, res) => {
    try {
      const groups = await storage.getAllMinistryGroups();
      return res.json({
        success: true,
        data: groups
      });
    } catch (error) {
      console.error('Error fetching ministry groups:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch ministry groups'
      });
    }
  });

  app.get('/api/community/ministry-groups/active', requireAuth, async (req, res) => {
    try {
      const groups = await storage.getActiveMinistryGroups();
      return res.json({
        success: true,
        data: groups
      });
    } catch (error) {
      console.error('Error fetching active ministry groups:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch active ministry groups'
      });
    }
  });

  app.post('/api/community/ministry-groups', requireAuth, async (req, res) => {
    try {
      const validatedData = insertMinistryGroupSchema.parse(req.body);
      
      const group = await storage.createMinistryGroup(validatedData);
      if (req.user) {
        await logUserActivity({
          userId: req.user.id,
          action: "create",
          entityType: "ministry_group",
          entityId: group.id,
          details: `Created ministry group: ${group.name}`,
          req
        });
      }
      
      return res.status(201).json({
        success: true,
        message: 'Ministry group created successfully',
        data: group
      });
    } catch (error) {
      console.error('Error creating ministry group:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create ministry group'
      });
    }
  });

  app.get('/api/community/ministry-groups/:id/members', requireAuth, async (req, res) => {
    try {
      const groupId = parseInt(req.params.id, 10);
      const members = await storage.getMembersByMinistryGroup(groupId);
      
      return res.json({
        success: true,
        data: members
      });
    } catch (error) {
      console.error('Error fetching ministry group members:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch ministry group members'
      });
    }
  });

  app.post('/api/community/ministry-groups/:id/members', requireAuth, async (req, res) => {
    try {
      const groupId = parseInt(req.params.id, 10);
      const { memberId, role } = req.body;
      
      if (!memberId || !role) {
        return res.status(400).json({
          success: false,
          message: 'Member ID and role are required'
        });
      }
      
      const memberData = insertMinistryGroupMemberSchema.parse({
        groupId,
        memberId: parseInt(memberId, 10),
        role
      });
      
      const groupMember = await storage.addMemberToGroup(memberData);
      if (req.user) {
        await logUserActivity({
          userId: req.user.id,
          action: "add_member",
          entityType: "ministry_group",
          entityId: groupId,
          details: `Added member ${memberData.memberId} to group ${groupId} with role ${role}`,
          req
        });
      }
      
      return res.status(201).json({
        success: true,
        message: 'Member added to ministry group successfully',
        data: groupMember
      });
    } catch (error) {
      console.error('Error adding member to ministry group:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to add member to ministry group'
      });
    }
  });

  app.delete('/api/community/ministry-groups/:groupId/members/:memberId', requireAuth, async (req, res) => {
    try {
      const groupId = parseInt(req.params.groupId, 10);
      const memberId = parseInt(req.params.memberId, 10);
      
      await storage.removeMemberFromGroup(groupId, memberId);
      if (req.user) {
        await logUserActivity({
          userId: req.user.id,
          action: "remove_member",
          entityType: "ministry_group",
          entityId: groupId,
          details: `Removed member ${memberId} from group ${groupId}`,
          req
        });
      }
      
      return res.json({
        success: true,
        message: 'Member removed from ministry group successfully'
      });
    } catch (error) {
      console.error('Error removing member from ministry group:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to remove member from ministry group'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
