import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum('user_role', ['admin', 'editor', 'media_manager']);
export const sermonCategoryEnum = pgEnum('sermon_category', ['Sunday Service', 'Bible Study', 'Special Event', 'Conference', 'Youth', 'Other']);
export const eventCategoryEnum = pgEnum('event_category', ['Service', 'Fellowship', 'Outreach', 'Holiday', 'Meeting', 'Conference', 'Other']);
export const galleryTagEnum = pgEnum('gallery_tag', ['all', 'hadassah', 'kingsmen', 'youth', 'service']);
export const magazineTypeEnum = pgEnum('magazine_type', ['weekly', 'monthly', 'quarterly', 'special']);
export const memberStatusEnum = pgEnum('member_status', ['active', 'inactive', 'visitor', 'new']);
export const ministryGroupEnum = pgEnum('ministry_group', ['hadassah', 'kingsmen', 'youth', 'worship', 'outreach', 'prayer', 'children']);

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

// Church Members - for community engagement dashboard
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  status: text("status").notNull().default('active'),
  ministryGroups: text("ministry_groups").array(),
  baptismDate: text("baptism_date"),
  membershipDate: text("membership_date"),
  birthday: text("birthday"),
  profileImage: text("profile_image"),
  notes: text("notes"),
  attendance: jsonb("attendance"), // JSON object with dates and attendance status
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMemberSchema = createInsertSchema(members).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  address: true,
  status: true,
  ministryGroups: true,
  baptismDate: true,
  membershipDate: true,
  birthday: true,
  profileImage: true,
  notes: true,
  attendance: true,
});

export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;

// Attendance Records for services and events
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  eventType: text("event_type").notNull(), // "service", "bible study", etc.
  date: timestamp("date").notNull(),
  totalCount: integer("total_count").notNull(),
  newVisitorsCount: integer("new_visitors_count").default(0),
  memberCount: integer("member_count").default(0),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAttendanceSchema = createInsertSchema(attendance).pick({
  eventId: true,
  eventType: true,
  date: true,
  totalCount: true,
  newVisitorsCount: true,
  memberCount: true,
  notes: true,
  createdBy: true,
});

export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;

// Small Groups or Ministry Teams
export const ministryGroups = pgTable("ministry_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  leader: integer("leader_id").references(() => members.id),
  assistantLeader: integer("assistant_leader_id").references(() => members.id),
  meetingDay: text("meeting_day"),
  meetingTime: text("meeting_time"),
  meetingLocation: text("meeting_location"),
  memberCount: integer("member_count").default(0),
  groupImage: text("group_image"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMinistryGroupSchema = createInsertSchema(ministryGroups).pick({
  name: true,
  description: true,
  leader: true,
  assistantLeader: true,
  meetingDay: true,
  meetingTime: true,
  meetingLocation: true,
  memberCount: true,
  groupImage: true,
  active: true,
});

export type InsertMinistryGroup = z.infer<typeof insertMinistryGroupSchema>;
export type MinistryGroup = typeof ministryGroups.$inferSelect;

// Ministry Group Members - Many-to-Many relationship
export const ministryGroupMembers = pgTable("ministry_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => ministryGroups.id),
  memberId: integer("member_id").notNull().references(() => members.id),
  role: text("role").default('member'), // leader, assistant_leader, member
  joinDate: timestamp("join_date").defaultNow(),
});

export const insertMinistryGroupMemberSchema = createInsertSchema(ministryGroupMembers).pick({
  groupId: true,
  memberId: true,
  role: true,
  joinDate: true,
});

export type InsertMinistryGroupMember = z.infer<typeof insertMinistryGroupMemberSchema>;
export type MinistryGroupMember = typeof ministryGroupMembers.$inferSelect;
