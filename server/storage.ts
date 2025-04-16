import { eq } from 'drizzle-orm';
import { db } from './db';
import { 
  User, 
  InsertUser, 
  Contact, 
  InsertContact, 
  NewsletterSubscriber, 
  InsertNewsletterSubscriber,
  Event,
  InsertEvent,
  Sermon,
  InsertSermon,
  Community,
  InsertCommunity,
  Leader,
  InsertLeader,
  Magazine,
  InsertMagazine,
  Page,
  InsertPage,
  Media,
  InsertMedia,
  Setting,
  InsertSetting,
  users,
  contactMessages,
  newsletterSubscribers,
  events,
  sermons,
  communities,
  leaders,
  magazines,
  pages,
  media,
  settings
} from '@shared/schema';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { pool } from './db';

const PostgresSessionStore = connectPgSimple(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Contact messages
  createContactMessage(message: InsertContact): Promise<Contact>;
  getAllContactMessages(): Promise<Contact[]>;
  getContactMessage(id: number): Promise<Contact | undefined>;
  markContactAsRead(id: number): Promise<boolean>;
  deleteContactMessage(id: number): Promise<boolean>;
  
  // Newsletter subscribers
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriber(id: number): Promise<NewsletterSubscriber | undefined>;
  updateNewsletterSubscriber(id: number, data: Partial<InsertNewsletterSubscriber>): Promise<NewsletterSubscriber | undefined>;
  deleteNewsletterSubscriber(id: number): Promise<boolean>;
  
  // Events
  createEvent(event: InsertEvent): Promise<Event>;
  getAllEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Sermons
  createSermon(sermon: InsertSermon): Promise<Sermon>;
  getAllSermons(): Promise<Sermon[]>;
  getSermon(id: number): Promise<Sermon | undefined>;
  updateSermon(id: number, data: Partial<InsertSermon>): Promise<Sermon | undefined>;
  deleteSermon(id: number): Promise<boolean>;
  
  // Communities/Ministries
  createCommunity(community: InsertCommunity): Promise<Community>;
  getAllCommunities(): Promise<Community[]>;
  getCommunity(id: number): Promise<Community | undefined>;
  updateCommunity(id: number, data: Partial<InsertCommunity>): Promise<Community | undefined>;
  deleteCommunity(id: number): Promise<boolean>;
  
  // Leadership
  createLeader(leader: InsertLeader): Promise<Leader>;
  getAllLeaders(): Promise<Leader[]>;
  getLeader(id: number): Promise<Leader | undefined>;
  updateLeader(id: number, data: Partial<InsertLeader>): Promise<Leader | undefined>;
  deleteLeader(id: number): Promise<boolean>;
  
  // Magazines
  createMagazine(magazine: InsertMagazine): Promise<Magazine>;
  getAllMagazines(): Promise<Magazine[]>;
  getMagazine(id: number): Promise<Magazine | undefined>;
  updateMagazine(id: number, data: Partial<InsertMagazine>): Promise<Magazine | undefined>;
  deleteMagazine(id: number): Promise<boolean>;
  
  // Pages
  createPage(page: InsertPage): Promise<Page>;
  getAllPages(): Promise<Page[]>;
  getPage(id: number): Promise<Page | undefined>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  updatePage(id: number, data: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: number): Promise<boolean>;
  
  // Media
  createMedia(mediaItem: InsertMedia): Promise<Media>;
  getAllMedia(): Promise<Media[]>;
  getMedia(id: number): Promise<Media | undefined>;
  updateMedia(id: number, data: Partial<InsertMedia>): Promise<Media | undefined>;
  deleteMedia(id: number): Promise<boolean>;
  
  // Settings
  setSetting(key: string, value: string): Promise<Setting>;
  getSetting(key: string): Promise<string | undefined>;
  getAllSettings(): Promise<Setting[]>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Create session store
    this.sessionStore = new PostgresSessionStore({
      pool,
      tableName: 'session',
      createTableIfMissing: true
    });
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Contact messages
  async createContactMessage(message: InsertContact): Promise<Contact> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }

  async getAllContactMessages(): Promise<Contact[]> {
    return await db.select().from(contactMessages);
  }

  async getContactMessage(id: number): Promise<Contact | undefined> {
    const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return result[0];
  }

  async markContactAsRead(id: number): Promise<boolean> {
    const result = await db.update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return result.length > 0;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
    return result.length > 0;
  }

  // Newsletter subscribers
  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const result = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return result[0];
  }

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers);
  }

  async getNewsletterSubscriber(id: number): Promise<NewsletterSubscriber | undefined> {
    const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    return result[0];
  }

  async updateNewsletterSubscriber(id: number, data: Partial<InsertNewsletterSubscriber>): Promise<NewsletterSubscriber | undefined> {
    const result = await db.update(newsletterSubscribers)
      .set(data)
      .where(eq(newsletterSubscribers.id, id))
      .returning();
    return result[0];
  }

  async deleteNewsletterSubscriber(id: number): Promise<boolean> {
    const result = await db.delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, id))
      .returning();
    return result.length > 0;
  }

  // Events
  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event | undefined> {
    const result = await db.update(events)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return result[0];
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id)).returning();
    return result.length > 0;
  }

  // Sermons
  async createSermon(sermon: InsertSermon): Promise<Sermon> {
    const result = await db.insert(sermons).values(sermon).returning();
    return result[0];
  }

  async getAllSermons(): Promise<Sermon[]> {
    return await db.select().from(sermons);
  }

  async getSermon(id: number): Promise<Sermon | undefined> {
    const result = await db.select().from(sermons).where(eq(sermons.id, id));
    return result[0];
  }

  async updateSermon(id: number, data: Partial<InsertSermon>): Promise<Sermon | undefined> {
    const result = await db.update(sermons)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sermons.id, id))
      .returning();
    return result[0];
  }

  async deleteSermon(id: number): Promise<boolean> {
    const result = await db.delete(sermons).where(eq(sermons.id, id)).returning();
    return result.length > 0;
  }

  // Communities/Ministries
  async createCommunity(community: InsertCommunity): Promise<Community> {
    const result = await db.insert(communities).values(community).returning();
    return result[0];
  }

  async getAllCommunities(): Promise<Community[]> {
    return await db.select().from(communities).orderBy(communities.order);
  }

  async getCommunity(id: number): Promise<Community | undefined> {
    const result = await db.select().from(communities).where(eq(communities.id, id));
    return result[0];
  }

  async updateCommunity(id: number, data: Partial<InsertCommunity>): Promise<Community | undefined> {
    const result = await db.update(communities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(communities.id, id))
      .returning();
    return result[0];
  }

  async deleteCommunity(id: number): Promise<boolean> {
    const result = await db.delete(communities).where(eq(communities.id, id)).returning();
    return result.length > 0;
  }

  // Leadership
  async createLeader(leader: InsertLeader): Promise<Leader> {
    const result = await db.insert(leaders).values(leader).returning();
    return result[0];
  }

  async getAllLeaders(): Promise<Leader[]> {
    return await db.select().from(leaders).orderBy(leaders.order);
  }

  async getLeader(id: number): Promise<Leader | undefined> {
    const result = await db.select().from(leaders).where(eq(leaders.id, id));
    return result[0];
  }

  async updateLeader(id: number, data: Partial<InsertLeader>): Promise<Leader | undefined> {
    const result = await db.update(leaders)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(leaders.id, id))
      .returning();
    return result[0];
  }

  async deleteLeader(id: number): Promise<boolean> {
    const result = await db.delete(leaders).where(eq(leaders.id, id)).returning();
    return result.length > 0;
  }

  // Magazines
  async createMagazine(magazine: InsertMagazine): Promise<Magazine> {
    const result = await db.insert(magazines).values(magazine).returning();
    return result[0];
  }

  async getAllMagazines(): Promise<Magazine[]> {
    return await db.select().from(magazines);
  }

  async getMagazine(id: number): Promise<Magazine | undefined> {
    const result = await db.select().from(magazines).where(eq(magazines.id, id));
    return result[0];
  }

  async updateMagazine(id: number, data: Partial<InsertMagazine>): Promise<Magazine | undefined> {
    const result = await db.update(magazines)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(magazines.id, id))
      .returning();
    return result[0];
  }

  async deleteMagazine(id: number): Promise<boolean> {
    const result = await db.delete(magazines).where(eq(magazines.id, id)).returning();
    return result.length > 0;
  }

  // Pages
  async createPage(page: InsertPage): Promise<Page> {
    const result = await db.insert(pages).values(page).returning();
    return result[0];
  }

  async getAllPages(): Promise<Page[]> {
    return await db.select().from(pages);
  }

  async getPage(id: number): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.id, id));
    return result[0];
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.slug, slug));
    return result[0];
  }

  async updatePage(id: number, data: Partial<InsertPage>): Promise<Page | undefined> {
    const result = await db.update(pages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return result[0];
  }

  async deletePage(id: number): Promise<boolean> {
    const result = await db.delete(pages).where(eq(pages.id, id)).returning();
    return result.length > 0;
  }

  // Media
  async createMedia(mediaItem: InsertMedia): Promise<Media> {
    const result = await db.insert(media).values(mediaItem).returning();
    return result[0];
  }

  async getAllMedia(): Promise<Media[]> {
    return await db.select().from(media);
  }

  async getMedia(id: number): Promise<Media | undefined> {
    const result = await db.select().from(media).where(eq(media.id, id));
    return result[0];
  }

  async updateMedia(id: number, data: Partial<InsertMedia>): Promise<Media | undefined> {
    const result = await db.update(media)
      .set(data)
      .where(eq(media.id, id))
      .returning();
    return result[0];
  }

  async deleteMedia(id: number): Promise<boolean> {
    const result = await db.delete(media).where(eq(media.id, id)).returning();
    return result.length > 0;
  }

  // Settings
  async setSetting(key: string, value: string): Promise<Setting> {
    // Try to update first, if the key already exists
    const existingResult = await db.update(settings)
      .set({ value, updatedAt: new Date() })
      .where(eq(settings.key, key))
      .returning();
    
    if (existingResult.length > 0) {
      return existingResult[0];
    }
    
    // If not, insert a new setting
    const result = await db.insert(settings)
      .values({ key, value })
      .returning();
    
    return result[0];
  }

  async getSetting(key: string): Promise<string | undefined> {
    const result = await db.select().from(settings).where(eq(settings.key, key));
    return result[0]?.value ?? undefined;
  }

  async getAllSettings(): Promise<Setting[]> {
    return await db.select().from(settings);
  }
}

export const storage = new DatabaseStorage();
