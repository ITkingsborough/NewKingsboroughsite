import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertNewsletterSchema,
  insertEventSchema,
  insertSermonSchema,
  insertCommunitySchema,
  insertLeaderSchema,
  insertMagazineSchema,
  insertPageSchema,
  insertMediaSchema
} from "@shared/schema";
import { setupAuth } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomBytes } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  const { isAdmin } = setupAuth(app);
  
  // Set up multer for file uploads
  const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
  
  // Create upload directory if it doesn't exist
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  
  const storage_config = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = randomBytes(8).toString("hex");
      const fileExtension = path.extname(file.originalname);
      cb(null, `${Date.now()}-${uniqueSuffix}${fileExtension}`);
    }
  });
  
  const upload = multer({ 
    storage: storage_config,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'image/webp',
        'application/pdf'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP and PDF are allowed.'));
      }
    }
  });
  
  // Helper function for error handling
  const handleError = (res: Response, error: any, message: string) => {
    console.error(`${message}:`, error);
    return res.status(400).json({
      success: false,
      message: error.message || message
    });
  };
  
  // Authentication check middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    console.log('Auth check failed: User not authenticated');
    return res.status(401).json({ message: "Unauthorized" });
  };
  
  // ===== PUBLIC API ROUTES =====
  
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
      return handleError(res, error, 'Error submitting contact form');
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
      return handleError(res, error, 'Error subscribing to newsletter');
    }
  });
  
  // Get all events
  app.get('/api/events', async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      return res.json(events);
    } catch (error) {
      return handleError(res, error, 'Error fetching events');
    }
  });
  
  // Get event by ID
  app.get('/api/events/:id', async (req, res) => {
    try {
      const event = await storage.getEvent(parseInt(req.params.id));
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.json(event);
    } catch (error) {
      return handleError(res, error, 'Error fetching event');
    }
  });
  
  // Get all sermons
  app.get('/api/sermons', async (req, res) => {
    try {
      const sermons = await storage.getAllSermons();
      return res.json(sermons);
    } catch (error) {
      return handleError(res, error, 'Error fetching sermons');
    }
  });
  
  // Get sermon by ID
  app.get('/api/sermons/:id', async (req, res) => {
    try {
      const sermon = await storage.getSermon(parseInt(req.params.id));
      if (!sermon) {
        return res.status(404).json({ message: 'Sermon not found' });
      }
      return res.json(sermon);
    } catch (error) {
      return handleError(res, error, 'Error fetching sermon');
    }
  });
  
  // Get all communities
  app.get('/api/communities', async (req, res) => {
    try {
      const communities = await storage.getAllCommunities();
      return res.json(communities);
    } catch (error) {
      return handleError(res, error, 'Error fetching communities');
    }
  });
  
  // Get community by ID
  app.get('/api/communities/:id', async (req, res) => {
    try {
      const community = await storage.getCommunity(parseInt(req.params.id));
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      return res.json(community);
    } catch (error) {
      return handleError(res, error, 'Error fetching community');
    }
  });
  
  // Get all leaders
  app.get('/api/leaders', async (req, res) => {
    try {
      const leaders = await storage.getAllLeaders();
      return res.json(leaders);
    } catch (error) {
      return handleError(res, error, 'Error fetching leaders');
    }
  });
  
  // Get leader by ID
  app.get('/api/leaders/:id', async (req, res) => {
    try {
      const leader = await storage.getLeader(parseInt(req.params.id));
      if (!leader) {
        return res.status(404).json({ message: 'Leader not found' });
      }
      return res.json(leader);
    } catch (error) {
      return handleError(res, error, 'Error fetching leader');
    }
  });
  
  // Get all magazines
  app.get('/api/magazines', async (req, res) => {
    try {
      const magazines = await storage.getAllMagazines();
      return res.json(magazines);
    } catch (error) {
      return handleError(res, error, 'Error fetching magazines');
    }
  });
  
  // Get magazine by ID
  app.get('/api/magazines/:id', async (req, res) => {
    try {
      const magazine = await storage.getMagazine(parseInt(req.params.id));
      if (!magazine) {
        return res.status(404).json({ message: 'Magazine not found' });
      }
      return res.json(magazine);
    } catch (error) {
      return handleError(res, error, 'Error fetching magazine');
    }
  });
  
  // Get all published pages
  app.get('/api/pages', async (req, res) => {
    try {
      const pages = await storage.getAllPages();
      // Filter out unpublished pages for public API
      const publishedPages = pages.filter(page => page.isPublished);
      return res.json(publishedPages);
    } catch (error) {
      return handleError(res, error, 'Error fetching pages');
    }
  });
  
  // Get page by slug
  app.get('/api/pages/:slug', async (req, res) => {
    try {
      const page = await storage.getPageBySlug(req.params.slug);
      if (!page || !page.isPublished) {
        return res.status(404).json({ message: 'Page not found' });
      }
      return res.json(page);
    } catch (error) {
      return handleError(res, error, 'Error fetching page');
    }
  });
  
  // ===== ADMIN API ROUTES =====
  
  // ===== EVENTS =====
  
  // Get all events (admin)
  app.get('/api/admin/events', isAuthenticated, async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      return res.json(events);
    } catch (error) {
      return handleError(res, error, 'Error fetching events');
    }
  });
  
  // Create event
  app.post('/api/admin/events', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const result = await storage.createEvent(validatedData);
      return res.status(201).json(result);
    } catch (error) {
      return handleError(res, error, 'Error creating event');
    }
  });
  
  // Update event
  app.put('/api/admin/events/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertEventSchema.partial().parse(req.body);
      const result = await storage.updateEvent(id, validatedData);
      
      if (!result) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      return res.json(result);
    } catch (error) {
      return handleError(res, error, 'Error updating event');
    }
  });
  
  // Delete event
  app.delete('/api/admin/events/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEvent(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      return res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      return handleError(res, error, 'Error deleting event');
    }
  });
  
  // ===== SERMONS =====
  
  // Get all sermons (admin)
  app.get('/api/admin/sermons', isAuthenticated, async (req, res) => {
    try {
      const sermons = await storage.getAllSermons();
      return res.json(sermons);
    } catch (error) {
      return handleError(res, error, 'Error fetching sermons');
    }
  });
  
  // Create sermon
  app.post('/api/sermons', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
      // Handle form data
      const formData = req.body;
      
      // Add image path if file was uploaded
      if (req.file) {
        formData.image = `/uploads/${req.file.filename}`;
      }
      
      const validatedData = insertSermonSchema.parse(formData);
      const result = await storage.createSermon(validatedData);
      return res.status(201).json(result);
    } catch (error) {
      return handleError(res, error, 'Error creating sermon');
    }
  });
  
  // Update sermon
  app.patch('/api/sermons/:id', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const formData = req.body;
      
      // Add image path if file was uploaded
      if (req.file) {
        formData.image = `/uploads/${req.file.filename}`;
      }
      
      const validatedData = insertSermonSchema.partial().parse(formData);
      const result = await storage.updateSermon(id, validatedData);
      
      if (!result) {
        return res.status(404).json({ message: 'Sermon not found' });
      }
      
      return res.json(result);
    } catch (error) {
      return handleError(res, error, 'Error updating sermon');
    }
  });
  
  // Delete sermon
  app.delete('/api/sermons/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get the sermon first to find the image path
      const sermon = await storage.getSermon(id);
      if (!sermon) {
        return res.status(404).json({ message: 'Sermon not found' });
      }
      
      // Delete from database
      const success = await storage.deleteSermon(id);
      
      if (success) {
        // Delete the image file if it exists
        if (sermon.image) {
          const imagePath = path.join(process.cwd(), 'public', sermon.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        
        return res.json({ message: 'Sermon deleted successfully' });
      } else {
        return res.status(500).json({ message: 'Failed to delete sermon from database' });
      }
    } catch (error) {
      return handleError(res, error, 'Error deleting sermon');
    }
  });
  
  // ===== COMMUNITIES =====
  
  // Get all communities (admin)
  app.get('/api/admin/communities', isAuthenticated, async (req, res) => {
    try {
      const communities = await storage.getAllCommunities();
      return res.json(communities);
    } catch (error) {
      return handleError(res, error, 'Error fetching communities');
    }
  });
  
  // Create community
  app.post('/api/admin/communities', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCommunitySchema.parse(req.body);
      const result = await storage.createCommunity(validatedData);
      return res.status(201).json(result);
    } catch (error) {
      return handleError(res, error, 'Error creating community');
    }
  });
  
  // Update community
  app.put('/api/admin/communities/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCommunitySchema.partial().parse(req.body);
      const result = await storage.updateCommunity(id, validatedData);
      
      if (!result) {
        return res.status(404).json({ message: 'Community not found' });
      }
      
      return res.json(result);
    } catch (error) {
      return handleError(res, error, 'Error updating community');
    }
  });
  
  // Delete community
  app.delete('/api/admin/communities/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCommunity(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Community not found' });
      }
      
      return res.json({ message: 'Community deleted successfully' });
    } catch (error) {
      return handleError(res, error, 'Error deleting community');
    }
  });
  
  // ===== LEADERS =====
  
  // Get all leaders (admin)
  app.get('/api/admin/leaders', isAuthenticated, async (req, res) => {
    try {
      const leaders = await storage.getAllLeaders();
      return res.json(leaders);
    } catch (error) {
      return handleError(res, error, 'Error fetching leaders');
    }
  });
  
  // Create leader
  app.post('/api/admin/leaders', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertLeaderSchema.parse(req.body);
      const result = await storage.createLeader(validatedData);
      return res.status(201).json(result);
    } catch (error) {
      return handleError(res, error, 'Error creating leader');
    }
  });
  
  // Update leader
  app.put('/api/admin/leaders/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertLeaderSchema.partial().parse(req.body);
      const result = await storage.updateLeader(id, validatedData);
      
      if (!result) {
        return res.status(404).json({ message: 'Leader not found' });
      }
      
      return res.json(result);
    } catch (error) {
      return handleError(res, error, 'Error updating leader');
    }
  });
  
  // Delete leader
  app.delete('/api/admin/leaders/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLeader(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Leader not found' });
      }
      
      return res.json({ message: 'Leader deleted successfully' });
    } catch (error) {
      return handleError(res, error, 'Error deleting leader');
    }
  });
  
  // ===== MAGAZINES =====
  
  // Get all magazines (admin)
  app.get('/api/admin/magazines', isAuthenticated, async (req, res) => {
    try {
      const magazines = await storage.getAllMagazines();
      return res.json(magazines);
    } catch (error) {
      return handleError(res, error, 'Error fetching magazines');
    }
  });
  
  // Create magazine
  app.post('/api/admin/magazines', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMagazineSchema.parse(req.body);
      const result = await storage.createMagazine(validatedData);
      return res.status(201).json(result);
    } catch (error) {
      return handleError(res, error, 'Error creating magazine');
    }
  });
  
  // Update magazine
  app.put('/api/admin/magazines/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMagazineSchema.partial().parse(req.body);
      const result = await storage.updateMagazine(id, validatedData);
      
      if (!result) {
        return res.status(404).json({ message: 'Magazine not found' });
      }
      
      return res.json(result);
    } catch (error) {
      return handleError(res, error, 'Error updating magazine');
    }
  });
  
  // Delete magazine
  app.delete('/api/admin/magazines/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMagazine(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Magazine not found' });
      }
      
      return res.json({ message: 'Magazine deleted successfully' });
    } catch (error) {
      return handleError(res, error, 'Error deleting magazine');
    }
  });
  
  // ===== PAGES =====
  
  // Get all pages (admin)
  app.get('/api/admin/pages', isAuthenticated, async (req, res) => {
    try {
      const pages = await storage.getAllPages();
      return res.json(pages);
    } catch (error) {
      return handleError(res, error, 'Error fetching pages');
    }
  });
  
  // Create page
  app.post('/api/admin/pages', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPageSchema.parse(req.body);
      const result = await storage.createPage(validatedData);
      return res.status(201).json(result);
    } catch (error) {
      return handleError(res, error, 'Error creating page');
    }
  });
  
  // Update page
  app.put('/api/admin/pages/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPageSchema.partial().parse(req.body);
      const result = await storage.updatePage(id, validatedData);
      
      if (!result) {
        return res.status(404).json({ message: 'Page not found' });
      }
      
      return res.json(result);
    } catch (error) {
      return handleError(res, error, 'Error updating page');
    }
  });
  
  // Delete page
  app.delete('/api/admin/pages/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePage(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Page not found' });
      }
      
      return res.json({ message: 'Page deleted successfully' });
    } catch (error) {
      return handleError(res, error, 'Error deleting page');
    }
  });
  
  // ===== MEDIA =====
  
  // Get all media
  app.get('/api/admin/media', isAuthenticated, async (req, res) => {
    try {
      const mediaItems = await storage.getAllMedia();
      return res.json(mediaItems);
    } catch (error) {
      return handleError(res, error, 'Error fetching media');
    }
  });
  
  // Upload media
  app.post('/api/admin/media/upload', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const file = req.file;
      const fileUrl = `/uploads/${file.filename}`;
      
      // Extract width and height for images
      let width, height;
      
      if (file.mimetype.startsWith('image/')) {
        // In a real implementation, you'd use a library like sharp to get dimensions
        // For simplicity, we'll just set these to null for now
        width = null;
        height = null;
      }
      
      const mediaItem = {
        filename: file.filename,
        originalFilename: file.originalname,
        url: fileUrl,
        fileType: file.mimetype,
        fileSize: file.size,
        width,
        height,
        altText: req.body.altText || file.originalname,
      };
      
      const result = await storage.createMedia(mediaItem);
      return res.status(201).json(result);
    } catch (error) {
      return handleError(res, error, 'Error uploading media');
    }
  });
  
  // Update media metadata
  app.put('/api/admin/media/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMediaSchema.partial().parse(req.body);
      const result = await storage.updateMedia(id, validatedData);
      
      if (!result) {
        return res.status(404).json({ message: 'Media not found' });
      }
      
      return res.json(result);
    } catch (error) {
      return handleError(res, error, 'Error updating media');
    }
  });
  
  // Delete media
  app.delete('/api/admin/media/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get media item first to know the filename
      const mediaItem = await storage.getMedia(id);
      
      if (!mediaItem) {
        return res.status(404).json({ message: 'Media not found' });
      }
      
      // Delete from database
      const success = await storage.deleteMedia(id);
      
      if (success) {
        // Delete file from filesystem
        const filePath = path.join(UPLOAD_DIR, mediaItem.filename);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        
        return res.json({ message: 'Media deleted successfully' });
      } else {
        return res.status(500).json({ message: 'Failed to delete media from database' });
      }
    } catch (error) {
      return handleError(res, error, 'Error deleting media');
    }
  });
  
  // ===== CONTACTS =====
  
  // Get all contacts
  app.get('/api/admin/contacts', isAuthenticated, async (req, res) => {
    try {
      const contacts = await storage.getAllContactMessages();
      return res.json(contacts);
    } catch (error) {
      return handleError(res, error, 'Error fetching contacts');
    }
  });
  
  // Get contact by ID
  app.get('/api/admin/contacts/:id', isAuthenticated, async (req, res) => {
    try {
      const contact = await storage.getContactMessage(parseInt(req.params.id));
      
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      return res.json(contact);
    } catch (error) {
      return handleError(res, error, 'Error fetching contact');
    }
  });
  
  // Mark contact as read
  app.post('/api/admin/contacts/:id/read', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markContactAsRead(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      return res.json({ message: 'Contact marked as read' });
    } catch (error) {
      return handleError(res, error, 'Error marking contact as read');
    }
  });
  
  // Delete contact
  app.delete('/api/admin/contacts/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContactMessage(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      return res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      return handleError(res, error, 'Error deleting contact');
    }
  });
  
  // ===== NEWSLETTER SUBSCRIBERS =====
  
  // Get all subscribers
  app.get('/api/admin/subscribers', isAuthenticated, async (req, res) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      return res.json(subscribers);
    } catch (error) {
      return handleError(res, error, 'Error fetching subscribers');
    }
  });
  
  // Update subscriber
  app.put('/api/admin/subscribers/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNewsletterSchema.partial().parse(req.body);
      const result = await storage.updateNewsletterSubscriber(id, validatedData);
      
      if (!result) {
        return res.status(404).json({ message: 'Subscriber not found' });
      }
      
      return res.json(result);
    } catch (error) {
      return handleError(res, error, 'Error updating subscriber');
    }
  });
  
  // Delete subscriber
  app.delete('/api/admin/subscribers/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNewsletterSubscriber(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Subscriber not found' });
      }
      
      return res.json({ message: 'Subscriber deleted successfully' });
    } catch (error) {
      return handleError(res, error, 'Error deleting subscriber');
    }
  });
  
  // ===== SETTINGS =====
  
  // Get all settings
  app.get('/api/admin/settings', isAuthenticated, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      return res.json(settings);
    } catch (error) {
      return handleError(res, error, 'Error fetching settings');
    }
  });
  
  // Set a setting
  app.post('/api/admin/settings', isAuthenticated, async (req, res) => {
    try {
      const { key, value } = req.body;
      
      if (!key || value === undefined) {
        return res.status(400).json({ message: 'Key and value are required' });
      }
      
      const result = await storage.setSetting(key, value);
      return res.json(result);
    } catch (error) {
      return handleError(res, error, 'Error setting setting');
    }
  });
  
  // Get setting by key
  app.get('/api/admin/settings/:key', isAuthenticated, async (req, res) => {
    try {
      const value = await storage.getSetting(req.params.key);
      
      if (value === undefined) {
        return res.status(404).json({ message: 'Setting not found' });
      }
      
      return res.json({ key: req.params.key, value });
    } catch (error) {
      return handleError(res, error, 'Error fetching setting');
    }
  });
  
  // ===== USERS =====
  
  // Get all users (admin only)
  app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
      return res.json(usersWithoutPasswords);
    } catch (error) {
      return handleError(res, error, 'Error fetching users');
    }
  });
  
  // Update user (admin only)
  app.put('/api/admin/users/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Don't allow password updates through this endpoint
      const { password, ...validatedData } = req.body;
      
      const result = await storage.updateUser(id, validatedData);
      
      if (!result) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = result;
      return res.json(userWithoutPassword);
    } catch (error) {
      return handleError(res, error, 'Error updating user');
    }
  });
  
  // Delete user (admin only)
  app.delete('/api/admin/users/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Don't allow deleting self
      if (req.user && req.user.id === id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }
      
      const success = await storage.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.json({ message: 'User deleted successfully' });
    } catch (error) {
      return handleError(res, error, 'Error deleting user');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
