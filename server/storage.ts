import { 
  users, type User, type InsertUser,
  contactMessages, type Contact, type InsertContact,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContactMessage(message: InsertContact): Promise<Contact>;
  getAllContactMessages(): Promise<Contact[]>;
  
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private newsletters: Map<number, NewsletterSubscriber>;
  
  private userCurrentId: number;
  private contactCurrentId: number;
  private newsletterCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.newsletters = new Map();
    
    this.userCurrentId = 1;
    this.contactCurrentId = 1;
    this.newsletterCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createContactMessage(message: InsertContact): Promise<Contact> {
    const id = this.contactCurrentId++;
    const contact: Contact = { 
      id, 
      name: message.name,
      email: message.email,
      message: message.message,
      phone: message.phone || null,
      isPrayer: message.isPrayer || null,
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }
  
  async getAllContactMessages(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
  
  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = this.newsletterCurrentId++;
    const newsletterSubscriber: NewsletterSubscriber = {
      ...subscriber,
      id,
      createdAt: new Date()
    };
    this.newsletters.set(id, newsletterSubscriber);
    return newsletterSubscriber;
  }
  
  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletters.values());
  }
}

export const storage = new MemStorage();
