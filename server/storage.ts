import { 
  users, type User, type InsertUser,
  contactMessages, type Contact, type InsertContact,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  activityLogs, type ActivityLog, type InsertActivityLog,
  sermons, type Sermon, type InsertSermon,
  events, type Event, type InsertEvent,
  galleryItems, type GalleryItem, type InsertGalleryItem,
  magazines, type Magazine, type InsertMagazine,
  members, type Member, type InsertMember,
  attendance, type Attendance, type InsertAttendance,
  ministryGroups, type MinistryGroup, type InsertMinistryGroup,
  ministryGroupMembers, type MinistryGroupMember, type InsertMinistryGroupMember
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, gte, lte, isNull, and, or, inArray, like, sql } from "drizzle-orm";
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
  
  // Magazines
  createMagazine(magazine: InsertMagazine): Promise<Magazine>;
  updateMagazine(id: number, magazine: Partial<InsertMagazine>): Promise<Magazine>;
  deleteMagazine(id: number): Promise<void>;
  getMagazine(id: number): Promise<Magazine | undefined>;
  getAllMagazines(): Promise<Magazine[]>;
  getFeaturedMagazines(limit?: number): Promise<Magazine[]>;
  getMagazinesByType(type: string): Promise<Magazine[]>;
  
  // Activity logs for CMS
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getUserActivityLogs(userId: number): Promise<ActivityLog[]>;
  
  // Community Engagement Dashboard - Members
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: number, member: Partial<InsertMember>): Promise<Member>;
  deleteMember(id: number): Promise<void>;
  getMember(id: number): Promise<Member | undefined>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  getAllMembers(): Promise<Member[]>;
  getMembersByStatus(status: string): Promise<Member[]>;
  getMembersByMinistryGroup(groupId: number): Promise<Member[]>;
  getRecentMembers(limit?: number): Promise<Member[]>;
  getMemberStats(): Promise<any>;
  
  // Community Engagement Dashboard - Attendance
  createAttendanceRecord(record: InsertAttendance): Promise<Attendance>;
  updateAttendanceRecord(id: number, record: Partial<InsertAttendance>): Promise<Attendance>;
  deleteAttendanceRecord(id: number): Promise<void>;
  getAttendanceRecord(id: number): Promise<Attendance | undefined>;
  getAllAttendanceRecords(): Promise<Attendance[]>;
  getAttendanceByDateRange(startDate: Date, endDate: Date): Promise<Attendance[]>;
  getAttendanceStats(): Promise<any>;
  
  // Community Engagement Dashboard - Ministry Groups
  createMinistryGroup(group: InsertMinistryGroup): Promise<MinistryGroup>;
  updateMinistryGroup(id: number, group: Partial<InsertMinistryGroup>): Promise<MinistryGroup>;
  deleteMinistryGroup(id: number): Promise<void>;
  getMinistryGroup(id: number): Promise<MinistryGroup | undefined>;
  getAllMinistryGroups(): Promise<MinistryGroup[]>;
  getActiveMinistryGroups(): Promise<MinistryGroup[]>;
  
  // Community Engagement Dashboard - Ministry Group Members
  addMemberToGroup(record: InsertMinistryGroupMember): Promise<MinistryGroupMember>;
  removeMemberFromGroup(groupId: number, memberId: number): Promise<void>;
  updateMemberGroupRole(groupId: number, memberId: number, role: string): Promise<MinistryGroupMember>;
  
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
      .where(eq(sermons.featured, true))
      .orderBy(desc(sermons.date))
      .limit(limit);
  }

  async getSermonsByCategory(category: string): Promise<Sermon[]> {
    // Since the actual database doesn't have a category column,
    // we'll just return all sermons
    return this.getAllSermons();
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
    const now = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    return db.select()
      .from(events)
      .where(sql`${events.date} >= ${now}`)
      .orderBy(asc(events.date));
  }

  async getFeaturedEvents(limit: number = 5): Promise<Event[]> {
    return db.select()
      .from(events)
      .where(eq(events.featured, true))
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
      .where(eq(galleryItems.featured, true))
      .orderBy(desc(galleryItems.date))
      .limit(limit);
  }

  // Magazine methods
  async createMagazine(magazine: InsertMagazine): Promise<Magazine> {
    const [newMagazine] = await db.insert(magazines).values(magazine).returning();
    return newMagazine;
  }

  async updateMagazine(id: number, magazine: Partial<InsertMagazine>): Promise<Magazine> {
    const [updatedMagazine] = await db
      .update(magazines)
      .set({
        ...magazine,
        updatedAt: new Date()
      })
      .where(eq(magazines.id, id))
      .returning();
    return updatedMagazine;
  }

  async deleteMagazine(id: number): Promise<void> {
    await db.delete(magazines).where(eq(magazines.id, id));
  }

  async getMagazine(id: number): Promise<Magazine | undefined> {
    const [magazine] = await db.select().from(magazines).where(eq(magazines.id, id));
    return magazine;
  }

  async getAllMagazines(): Promise<Magazine[]> {
    return db.select().from(magazines).orderBy(desc(magazines.date));
  }

  async getFeaturedMagazines(limit: number = 5): Promise<Magazine[]> {
    return db.select()
      .from(magazines)
      .where(eq(magazines.featured, true))
      .orderBy(desc(magazines.date))
      .limit(limit);
  }

  async getMagazinesByType(type: string): Promise<Magazine[]> {
    return db.select()
      .from(magazines)
      .where(eq(magazines.type, type))
      .orderBy(desc(magazines.date));
  }

  // Community Engagement Dashboard - Members
  async createMember(member: InsertMember): Promise<Member> {
    const [newMember] = await db.insert(members).values(member).returning();
    return newMember;
  }

  async updateMember(id: number, member: Partial<InsertMember>): Promise<Member> {
    const [updatedMember] = await db
      .update(members)
      .set({
        ...member,
        updatedAt: new Date()
      })
      .where(eq(members.id, id))
      .returning();
    return updatedMember;
  }

  async deleteMember(id: number): Promise<void> {
    await db.delete(members).where(eq(members.id, id));
  }

  async getMember(id: number): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member;
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.email, email));
    return member;
  }

  async getAllMembers(): Promise<Member[]> {
    return db.select().from(members).orderBy(asc(members.lastName));
  }

  async getMembersByStatus(status: string): Promise<Member[]> {
    return db.select()
      .from(members)
      .where(eq(members.status, status))
      .orderBy(asc(members.lastName));
  }

  async getMembersByMinistryGroup(groupId: number): Promise<Member[]> {
    const groupMembers = await db.select()
      .from(ministryGroupMembers)
      .where(eq(ministryGroupMembers.groupId, groupId));
    
    if (groupMembers.length === 0) {
      return [];
    }
    
    const memberIds = groupMembers.map(gm => gm.memberId);
    
    return db.select()
      .from(members)
      .where(inArray(members.id, memberIds))
      .orderBy(asc(members.lastName));
  }

  async getRecentMembers(limit: number = 10): Promise<Member[]> {
    return db.select()
      .from(members)
      .orderBy(desc(members.createdAt))
      .limit(limit);
  }

  async getMemberStats(): Promise<any> {
    // Get total member count by status
    const allMembers = await this.getAllMembers();
    
    // Count members by status
    const statusCounts = {
      active: 0,
      inactive: 0,
      visitor: 0,
      new: 0,
      total: allMembers.length
    };
    
    allMembers.forEach(member => {
      if (member.status === 'active') statusCounts.active++;
      else if (member.status === 'inactive') statusCounts.inactive++;
      else if (member.status === 'visitor') statusCounts.visitor++;
      else if (member.status === 'new') statusCounts.new++;
    });
    
    // Get new members in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentMembers = allMembers.filter(m => 
      m.createdAt ? new Date(m.createdAt) >= thirtyDaysAgo : false
    );
    
    return {
      memberCounts: statusCounts,
      newMembersThisMonth: recentMembers.length
    };
  }

  // Community Engagement Dashboard - Attendance
  async createAttendanceRecord(record: InsertAttendance): Promise<Attendance> {
    const [newRecord] = await db.insert(attendance).values(record).returning();
    return newRecord;
  }

  async updateAttendanceRecord(id: number, record: Partial<InsertAttendance>): Promise<Attendance> {
    const [updatedRecord] = await db
      .update(attendance)
      .set({
        ...record,
        updatedAt: new Date()
      })
      .where(eq(attendance.id, id))
      .returning();
    return updatedRecord;
  }

  async deleteAttendanceRecord(id: number): Promise<void> {
    await db.delete(attendance).where(eq(attendance.id, id));
  }

  async getAttendanceRecord(id: number): Promise<Attendance | undefined> {
    const [record] = await db.select().from(attendance).where(eq(attendance.id, id));
    return record;
  }

  async getAllAttendanceRecords(): Promise<Attendance[]> {
    return db.select().from(attendance).orderBy(desc(attendance.date));
  }

  async getAttendanceByDateRange(startDate: Date, endDate: Date): Promise<Attendance[]> {
    return db.select()
      .from(attendance)
      .where(
        and(
          gte(attendance.date, startDate),
          lte(attendance.date, endDate)
        )
      )
      .orderBy(asc(attendance.date));
  }

  async getAttendanceStats(): Promise<any> {
    const records = await this.getAllAttendanceRecords();
    
    if (records.length === 0) {
      return {
        averageAttendance: 0,
        totalAttendance: 0,
        highestAttendance: 0,
        lowestAttendance: 0,
        newVisitorAverage: 0,
        totalNewVisitors: 0
      };
    }
    
    const totalAttendance = records.reduce((sum, record) => sum + record.totalCount, 0);
    const highestAttendance = Math.max(...records.map(r => r.totalCount));
    const lowestAttendance = Math.min(...records.map(r => r.totalCount));
    const averageAttendance = Math.round(totalAttendance / records.length);
    
    const totalNewVisitors = records.reduce((sum, record) => sum + (record.newVisitorsCount || 0), 0);
    const newVisitorAverage = Math.round(totalNewVisitors / records.length);
    
    // Get records for just the last 12 weeks
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84); // 12 weeks * 7 days
    
    const recentRecords = records.filter(r => new Date(r.date) >= twelveWeeksAgo);
    
    // Group by event type for recent records
    const eventTypeCounts: Record<string, { count: number, total: number }> = {};
    
    recentRecords.forEach(record => {
      if (!eventTypeCounts[record.eventType]) {
        eventTypeCounts[record.eventType] = { count: 0, total: 0 };
      }
      eventTypeCounts[record.eventType].count++;
      eventTypeCounts[record.eventType].total += record.totalCount;
    });
    
    // Calculate averages by event type
    const eventTypeAverages: Record<string, number> = {};
    
    Object.keys(eventTypeCounts).forEach(type => {
      eventTypeAverages[type] = Math.round(
        eventTypeCounts[type].total / eventTypeCounts[type].count
      );
    });
    
    return {
      averageAttendance,
      totalAttendance,
      highestAttendance,
      lowestAttendance,
      newVisitorAverage,
      totalNewVisitors,
      eventTypeAverages
    };
  }

  // Community Engagement Dashboard - Ministry Groups
  async createMinistryGroup(group: InsertMinistryGroup): Promise<MinistryGroup> {
    const [newGroup] = await db.insert(ministryGroups).values(group).returning();
    return newGroup;
  }

  async updateMinistryGroup(id: number, group: Partial<InsertMinistryGroup>): Promise<MinistryGroup> {
    const [updatedGroup] = await db
      .update(ministryGroups)
      .set({
        ...group,
        updatedAt: new Date()
      })
      .where(eq(ministryGroups.id, id))
      .returning();
    return updatedGroup;
  }

  async deleteMinistryGroup(id: number): Promise<void> {
    // First delete all group memberships
    await db.delete(ministryGroupMembers).where(eq(ministryGroupMembers.groupId, id));
    // Then delete the group
    await db.delete(ministryGroups).where(eq(ministryGroups.id, id));
  }

  async getMinistryGroup(id: number): Promise<MinistryGroup | undefined> {
    const [group] = await db.select().from(ministryGroups).where(eq(ministryGroups.id, id));
    return group;
  }

  async getAllMinistryGroups(): Promise<MinistryGroup[]> {
    return db.select().from(ministryGroups).orderBy(asc(ministryGroups.name));
  }

  async getActiveMinistryGroups(): Promise<MinistryGroup[]> {
    return db.select()
      .from(ministryGroups)
      .where(eq(ministryGroups.active, true))
      .orderBy(asc(ministryGroups.name));
  }

  // Community Engagement Dashboard - Ministry Group Members
  async addMemberToGroup(record: InsertMinistryGroupMember): Promise<MinistryGroupMember> {
    // Check if relationship already exists
    const [existingRelation] = await db.select()
      .from(ministryGroupMembers)
      .where(
        and(
          eq(ministryGroupMembers.groupId, record.groupId),
          eq(ministryGroupMembers.memberId, record.memberId)
        )
      );
    
    if (existingRelation) {
      return existingRelation;
    }
    
    // Add the relationship
    const [newRelation] = await db.insert(ministryGroupMembers).values(record).returning();
    
    // Update member count in the group
    const groupMembers = await db.select()
      .from(ministryGroupMembers)
      .where(eq(ministryGroupMembers.groupId, record.groupId));
    
    await db.update(ministryGroups)
      .set({ memberCount: groupMembers.length })
      .where(eq(ministryGroups.id, record.groupId));
    
    return newRelation;
  }

  async removeMemberFromGroup(groupId: number, memberId: number): Promise<void> {
    // Remove the relationship
    await db.delete(ministryGroupMembers)
      .where(
        and(
          eq(ministryGroupMembers.groupId, groupId),
          eq(ministryGroupMembers.memberId, memberId)
        )
      );
    
    // Update member count in the group
    const groupMembers = await db.select()
      .from(ministryGroupMembers)
      .where(eq(ministryGroupMembers.groupId, groupId));
    
    await db.update(ministryGroups)
      .set({ memberCount: groupMembers.length })
      .where(eq(ministryGroups.id, groupId));
  }

  async updateMemberGroupRole(groupId: number, memberId: number, role: string): Promise<MinistryGroupMember> {
    const [updatedRelation] = await db.update(ministryGroupMembers)
      .set({ role })
      .where(
        and(
          eq(ministryGroupMembers.groupId, groupId),
          eq(ministryGroupMembers.memberId, memberId)
        )
      )
      .returning();
    
    // If role is 'leader', update the ministry group leader
    if (role === 'leader') {
      await db.update(ministryGroups)
        .set({ leader: memberId })
        .where(eq(ministryGroups.id, groupId));
    }
    // If role is 'assistant_leader', update the ministry group assistant leader
    else if (role === 'assistant_leader') {
      await db.update(ministryGroups)
        .set({ assistantLeader: memberId })
        .where(eq(ministryGroups.id, groupId));
    }
    
    return updatedRelation;
  }
}

export const storage = new DatabaseStorage();
