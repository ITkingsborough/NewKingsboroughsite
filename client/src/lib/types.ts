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
