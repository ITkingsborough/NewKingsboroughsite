import { 
  users, type User, type InsertUser,
  contactMessages, type Contact, type InsertContact,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  activityLogs, type ActivityLog, type InsertActivityLog,
  sermons, type Sermon, type InsertSermon,
  events, type Event, type InsertEvent,
  galleryItems, type GalleryItem, type InsertGalleryItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, gte, isNull, and, or, inArray, like, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(userId: number): Promise<void>;
  
  // Contact form messages
  createContactMessage(message: InsertContact): Promise<Contact>;
  getAllContactMessages(): Promise<Contact[]>;
  getContactMessage(id: number): Promise<Contact | undefined>;
  deleteContactMessage(id: number): Promise<void>;
  
  // Newsletter subscribers
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  
  // Sermons
  createSermon(sermon: InsertSermon): Promise<Sermon>;
  updateSermon(id: number, sermon: Partial<InsertSermon>): Promise<Sermon>;
  deleteSermon(id: number): Promise<void>;
  getSermon(id: number): Promise<Sermon | undefined>;
  getAllSermons(): Promise<Sermon[]>;
  getFeaturedSermons(limit?: number): Promise<Sermon[]>;
  getSermonsByCategory(category: string): Promise<Sermon[]>;
  
  // Events
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getFutureEvents(): Promise<Event[]>;
  getFeaturedEvents(limit?: number): Promise<Event[]>;
  
  // Gallery
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  updateGalleryItem(id: number, item: Partial<InsertGalleryItem>): Promise<GalleryItem>;
  deleteGalleryItem(id: number): Promise<void>;
  getGalleryItem(id: number): Promise<GalleryItem | undefined>;
  getAllGalleryItems(): Promise<GalleryItem[]>;
  getGalleryItemsByTag(tag: string): Promise<GalleryItem[]>;
  getFeaturedGalleryItems(limit?: number): Promise<GalleryItem[]>;
  
  // Activity logs for CMS
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getUserActivityLogs(userId: number): Promise<ActivityLog[]>;
  
  // Session store
  sessionStore: session.Store;
}

// PostgreSQL-based storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      tableName: 'user_sessions',
      createTableIfMissing: true,
      disableTouch: true // Prevent constant updates
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser
    }).returning();
    return user;
  }
  
  async updateUserLastLogin(userId: number): Promise<void> {
    // Skip update as lastLogin column doesn't exist in current schema
    return;
  }
  
  async createContactMessage(message: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contactMessages).values(message).returning();
    return contact;
  }
  
  async getAllContactMessages(): Promise<Contact[]> {
    return db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  }
  
  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [newsletterSubscriber] = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return newsletterSubscriber;
  }
  
  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return db.select().from(newsletterSubscribers).orderBy(newsletterSubscribers.createdAt);
  }
  
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [activityLog] = await db.insert(activityLogs).values(log).returning();
    return activityLog;
  }
  
  async getUserActivityLogs(userId: number): Promise<ActivityLog[]> {
    return db.select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .orderBy(activityLogs.createdAt);
  }

  // Contact message methods
  async getContactMessage(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return contact;
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  // Sermon methods
  async createSermon(sermon: InsertSermon): Promise<Sermon> {
    const [newSermon] = await db.insert(sermons).values(sermon).returning();
    return newSermon;
  }

  async updateSermon(id: number, sermon: Partial<InsertSermon>): Promise<Sermon> {
    const [updatedSermon] = await db
      .update(sermons)
      .set({
        ...sermon,
        updatedAt: new Date()
      })
      .where(eq(sermons.id, id))
      .returning();
    return updatedSermon;
  }

  async deleteSermon(id: number): Promise<void> {
    await db.delete(sermons).where(eq(sermons.id, id));
  }

  async getSermon(id: number): Promise<Sermon | undefined> {
    const [sermon] = await db.select().from(sermons).where(eq(sermons.id, id));
    return sermon;
  }

  async getAllSermons(): Promise<Sermon[]> {
    return db.select().from(sermons).orderBy(desc(sermons.date));
  }

  async getFeaturedSermons(limit: number = 5): Promise<Sermon[]> {
    return db.select()
      .from(sermons)
      .where(sql`${sermons.featuredOrder} IS NOT NULL`)
      .orderBy(asc(sermons.featuredOrder))
      .limit(limit);
  }

  async getSermonsByCategory(category: string): Promise<Sermon[]> {
    return db.select()
      .from(sermons)
      .where(eq(sermons.category, category))
      .orderBy(desc(sermons.date));
  }

  // Event methods
  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const [updatedEvent] = await db
      .update(events)
      .set({
        ...event,
        updatedAt: new Date()
      })
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getAllEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(asc(events.date));
  }

  async getFutureEvents(): Promise<Event[]> {
    const now = new Date();
    return db.select()
      .from(events)
      .where(gte(events.date, now))
      .orderBy(asc(events.date));
  }

  async getFeaturedEvents(limit: number = 5): Promise<Event[]> {
    return db.select()
      .from(events)
      .where(eq(events.isFeatured, true))
      .orderBy(asc(events.date))
      .limit(limit);
  }

  // Gallery methods
  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const [newItem] = await db.insert(galleryItems).values(item).returning();
    return newItem;
  }

  async updateGalleryItem(id: number, item: Partial<InsertGalleryItem>): Promise<GalleryItem> {
    const [updatedItem] = await db
      .update(galleryItems)
      .set({
        ...item,
        updatedAt: new Date()
      })
      .where(eq(galleryItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  }

  async getGalleryItem(id: number): Promise<GalleryItem | undefined> {
    const [item] = await db.select().from(galleryItems).where(eq(galleryItems.id, id));
    return item;
  }

  async getAllGalleryItems(): Promise<GalleryItem[]> {
    return db.select()
      .from(galleryItems)
      .orderBy(desc(galleryItems.date));
  }

  async getGalleryItemsByTag(tag: string): Promise<GalleryItem[]> {
    return db.select()
      .from(galleryItems)
      .where(
        sql`${tag} = ANY(${galleryItems.tags})`
      )
      .orderBy(desc(galleryItems.date));
  }

  async getFeaturedGalleryItems(limit: number = 10): Promise<GalleryItem[]> {
    return db.select()
      .from(galleryItems)
      .where(eq(galleryItems.isFeatured, true))
      .orderBy(desc(galleryItems.date))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
