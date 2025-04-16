import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum('user_role', ['admin', 'editor', 'media_manager']);
export const sermonCategoryEnum = pgEnum('sermon_category', ['Sunday Service', 'Bible Study', 'Special Event', 'Conference', 'Youth', 'Other']);
export const eventCategoryEnum = pgEnum('event_category', ['Service', 'Fellowship', 'Outreach', 'Holiday', 'Meeting', 'Conference', 'Other']);
export const galleryTagEnum = pgEnum('gallery_tag', ['all', 'hadassah', 'kingsmen', 'youth', 'service']);

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
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  series: text("series"),
  category: text("category").notNull().default('Sunday Service'),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url"),
  audioUrl: text("audio_url"),
  featuredOrder: integer("featured_order"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const insertSermonSchema = createInsertSchema(sermons).pick({
  title: true,
  speaker: true,
  date: true,
  description: true,
  series: true,
  category: true,
  imageUrl: true,
  videoUrl: true,
  audioUrl: true,
  featuredOrder: true,
  createdBy: true,
  updatedBy: true,
});

export type InsertSermon = z.infer<typeof insertSermonSchema>;
export type Sermon = typeof sermons.$inferSelect;

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default('Service'),
  imageUrl: text("image_url").notNull(),
  registerUrl: text("register_url"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  date: true,
  time: true,
  location: true,
  description: true,
  category: true,
  imageUrl: true,
  registerUrl: true,
  isFeatured: true,
  createdBy: true,
  updatedBy: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Gallery Items
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  tags: text("tags").array().notNull(),
  date: timestamp("date").notNull(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).pick({
  title: true,
  description: true,
  imageUrl: true,
  tags: true,
  date: true,
  isFeatured: true,
  createdBy: true,
  updatedBy: true,
});

export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = typeof galleryItems.$inferSelect;
