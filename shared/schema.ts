import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum('user_role', ['admin', 'editor', 'media_manager']);
export const sermonCategoryEnum = pgEnum('sermon_category', ['Sunday Service', 'Bible Study', 'Special Event', 'Conference', 'Youth', 'Other']);
export const eventCategoryEnum = pgEnum('event_category', ['Service', 'Fellowship', 'Outreach', 'Holiday', 'Meeting', 'Conference', 'Other']);
export const galleryTagEnum = pgEnum('gallery_tag', ['all', 'hadassah', 'kingsmen', 'youth', 'service']);
export const magazineTypeEnum = pgEnum('magazine_type', ['weekly', 'monthly', 'quarterly', 'special']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default('editor'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
  role: true,
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  isPrayer: boolean("is_prayer").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  phone: true,
  message: true,
  isPrayer: true,
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNewsletterSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactMessages.$inferSelect;

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Activity Logs for CMS
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(), // e.g., "sermon", "event", "gallery", etc.
  entityId: integer("entity_id"), // Optional, may be null for actions like "login"
  details: text("details"), // JSON stringified details
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  userId: true,
  action: true,
  entityType: true,
  entityId: true,
  details: true,
  ipAddress: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Sermons
export const sermons = pgTable("sermons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  speaker: text("speaker").notNull(),
  date: text("date").notNull(), // Changed from timestamp to text
  description: text("description").notNull(),
  series: text("series"),
  preacher: text("preacher"),
  image: text("image"), // Changed from imageUrl to image
  video_url: text("video_url"), // Kept as is
  audio_url: text("audio_url"), // Kept as is
  download_url: text("download_url"),
  featured: boolean("featured").default(false), // Changed from featuredOrder to featured
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSermonSchema = createInsertSchema(sermons).pick({
  title: true,
  speaker: true,
  date: true,
  description: true,
  series: true,
  preacher: true,
  image: true,
  video_url: true,
  audio_url: true,
  download_url: true,
  featured: true,
});

export type InsertSermon = z.infer<typeof insertSermonSchema>;
export type Sermon = typeof sermons.$inferSelect;

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(), // Changed from timestamp to text
  time: text("time").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  image: text("image"), // Changed from imageUrl to image
  featured: boolean("featured").default(false), // Changed from isFeatured to featured
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  date: true,
  time: true,
  location: true,
  description: true,
  image: true,
  featured: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Gallery Items
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  // Map image field to image_url column in database
  image: text("image_url").notNull(),
  tags: text("tags").array().notNull(),
  date: timestamp("date").notNull(),
  // Map featured field to is_featured column in database
  featured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).pick({
  title: true,
  description: true,
  image: true,
  tags: true,
  date: true,
  featured: true,
  createdBy: true,
  updatedBy: true,
});

export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = typeof galleryItems.$inferSelect;

// Magazines
export const magazines = pgTable("magazines", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull().default('monthly'),
  date: text("date").notNull(), // Publication date as text (e.g., "June 2023")
  coverImage: text("cover_image").notNull(), // Cover image path
  summary: text("summary").notNull(), // Summary of the magazine
  pdfUrl: text("pdf_url").notNull(), // PDF file path
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const insertMagazineSchema = createInsertSchema(magazines).pick({
  title: true,
  description: true,
  type: true,
  date: true,
  coverImage: true,
  summary: true,
  pdfUrl: true,
  featured: true,
  createdBy: true,
  updatedBy: true,
});

export type InsertMagazine = z.infer<typeof insertMagazineSchema>;
export type Magazine = typeof magazines.$inferSelect;
