import { 
  users, type User, type InsertUser,
  contactMessages, type Contact, type InsertContact,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  activityLogs, type ActivityLog, type InsertActivityLog
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
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
  
  // Newsletter subscribers
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  
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
    const now = new Date();
    const [user] = await db.insert(users).values({
      ...insertUser,
      active: true,
      createdAt: now,
      updatedAt: now
    }).returning();
    return user;
  }
  
  async updateUserLastLogin(userId: number): Promise<void> {
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, userId));
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
}

export const storage = new DatabaseStorage();
