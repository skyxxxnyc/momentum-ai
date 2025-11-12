export type Stage = 'Lead' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed-Won' | 'Closed-Lost';
export interface Contact {
  id: string;
  name: string;
  email: string;
  title: string;
  companyId: string;
  avatarUrl?: string;
  lastContacted: string;
  relationshipStrength?: number;
  referredById?: string;
}
export interface Company {
  id: string;
  name:string;
  industry: string;
  employees: number;
  location: string;
  logoUrl?: string;
  relationshipStrength?: number;
}
export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: Stage;
  contactId: string;
  companyId: string;
  ownerId: string;
  closeDate: string;
  lastActivity?: string;
  momentumScore?: number;
}
export interface Activity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  subject: string;
  date: string;
  contactId: string;
  dealId?: string;
  userId: string;
  companyId: string;
}
export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  content: string;
}
export interface ICP {
  id: string;
  name: string;
  industries: string[];
  companySize: [number, number];
  location: string;
  keywords: string[];
}
export interface Lead {
  id: string;
  name: string;
  title: string;
  companyName: string;
  email: string;
  location: string;
  status: 'New' | 'Contacted' | 'Qualified';
  leadScore: number;
}
export interface Notification {
  id: string;
  type: 'reminder' | 'suggestion' | 'ai_advice';
  message: string;
  isRead: boolean;
  createdAt: string;
  dealId?: string;
  contactId?: string;
}
export interface Comment {
  id: string;
  dealId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  avatarUrl: string;
}