export type Stage = 'Lead' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed-Won' | 'Closed-Lost';
export interface Contact {
  id: string;
  name: string;
  email: string;
  title: string;
  companyId: string;
  avatarUrl?: string;
  lastContacted: string;
}
export interface Company {
  id: string;
  name:string;
  industry: string;
  employees: number;
  location: string;
  logoUrl?: string;
}
export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: Stage;
  contactId: string;
  companyId: string;
  closeDate: string;
}
export interface Activity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  subject: string;
  date: string;
  contactId: string;
}