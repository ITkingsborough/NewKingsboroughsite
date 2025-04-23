export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

export interface SermonItem {
  id: number;
  title: string;
  speaker: string;
  date: string;
  series?: string;
  description: string;
  image: string;
}

export interface MinistryItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface LeaderItem {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  isPrayer: boolean;
}

export interface NewsletterFormData {
  email: string;
}

export interface MagazineItem {
  id: number;
  title: string;
  date: string;
  coverImage: string;
  summary: string;
  pdfUrl: string;
}

// Community Dashboard Types
export const memberStatusEnum = ['active', 'inactive', 'visitor', 'new'] as const;
export type MemberStatus = typeof memberStatusEnum[number];

export interface MemberItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  status: MemberStatus;
  profileImage?: string;
  baptismDate?: string;
  membershipDate?: string;
  birthday?: string;
  notes?: string;
  ministryGroups?: string[];
  createdAt?: string;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  eventType: string;
  totalCount: number;
  newVisitorsCount?: number;
  memberCount?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  eventId?: number;
}

export interface AttendanceStats {
  averageAttendance: number;
  totalAttendance: number;
  highestAttendance: number;
  lowestAttendance: number;
  newVisitorAverage: number;
  totalNewVisitors: number;
  eventTypeAverages?: Record<string, number>;
}

export interface MemberStats {
  totalMembers: number;
  newMembersThisMonth: number;
  memberCounts: Record<string, number>;
}

export interface MinistryGroup {
  id: number;
  name: string;
  description: string;
  leader?: number;
  assistantLeader?: number;
  meetingDay?: string;
  meetingTime?: string;
  meetingLocation?: string;
  memberCount: number;
  groupImage?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MinistryGroupMember {
  id: number;
  groupId: number;
  memberId: number;
  role: string;
  joinDate: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}
