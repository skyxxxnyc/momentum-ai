import { DurableObject } from 'cloudflare:workers';
import type { Env } from './core-utils';
import { Contact, Company, Deal, ICP, Lead, Article, Activity, Notification } from '../src/lib/types';
import { CONTACTS, COMPANIES, DEALS, ICPS, LEADS, ARTICLES, ACTIVITIES } from '../src/lib/mock-data';
type CrmEntity = 'contacts' | 'companies' | 'deals' | 'icps' | 'leads' | 'articles' | 'activities' | 'notifications';
type CrmData = Contact | Company | Deal | ICP | Lead | Article | Activity | Notification;
interface CrmStorage {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  icps: ICP[];
  leads: Lead[];
  articles: Article[];
  activities: Activity[];
  notifications: Notification[];
}
export class AppController extends DurableObject<Env> {
  private state: CrmStorage = {
    contacts: [],
    companies: [],
    deals: [],
    icps: [],
    leads: [],
    articles: [],
    activities: [],
    notifications: [],
  };
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const stored = await this.ctx.storage.get<CrmStorage>('crm_data');
      if (stored && stored.contacts?.length > 0) {
        this.state = { ...stored, notifications: stored.notifications || [] }; // Ensure notifications array exists for backward compatibility
      } else {
        // First-time initialization with mock data
        this.state = {
          contacts: CONTACTS,
          companies: COMPANIES,
          deals: DEALS,
          icps: ICPS,
          leads: LEADS,
          articles: ARTICLES,
          activities: ACTIVITIES,
          notifications: [],
        };
        await this.persist();
      }
      this.loaded = true;
    }
  }
  private async persist(): Promise<void> {
    await this.ctx.storage.put('crm_data', this.state);
  }
  async fetch(request: Request): Promise<Response> {
    await this.ensureLoaded();
    const url = new URL(request.url);
    const [_, _api, entity, id, action] = url.pathname.split('/');
    const entityKey = entity as CrmEntity;
    try {
      if (entityKey === 'notifications') {
        return this.handleNotificationsRequest(request, id);
      }
      switch (request.method) {
        case 'GET':
          return Response.json({ success: true, data: this.state[entityKey] || [] });
        case 'POST': {
          if (action === 'convert' && entityKey === 'leads') {
            const result = await this.convertLead(id);
            return Response.json({ success: true, data: result });
          }
          const newData = await request.json<CrmData>();
          this.state[entityKey].unshift(newData as any);
          await this.persist();
          return Response.json({ success: true, data: newData });
        }
        case 'PUT': {
          const updatedData = await request.json<CrmData>();
          const index = this.state[entityKey].findIndex((item: CrmData) => item.id === id);
          if (index === -1) return new Response('Not Found', { status: 404 });
          this.state[entityKey][index] = updatedData as any;
          await this.persist();
          return Response.json({ success: true, data: updatedData });
        }
        case 'DELETE': {
          const initialLength = this.state[entityKey].length;
          this.state[entityKey] = this.state[entityKey].filter((item: CrmData) => item.id !== id) as any;
          if (this.state[entityKey].length === initialLength) return new Response('Not Found', { status: 404 });
          await this.persist();
          return Response.json({ success: true, data: { id } });
        }
        default:
          return new Response('Method Not Allowed', { status: 405 });
      }
    } catch (error) {
      console.error(`Error in AppController for ${entity}:`, error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
  private async handleNotificationsRequest(request: Request, id: string): Promise<Response> {
    switch (request.method) {
      case 'GET': {
        const sortedNotifications = this.state.notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return Response.json({ success: true, data: sortedNotifications });
      }
      case 'POST':
        if (id === 'generate') {
          const newNotifications = this.generateNotifications();
          this.state.notifications.unshift(...newNotifications);
          await this.persist();
          return Response.json({ success: true, data: newNotifications });
        }
        return new Response('Not Found', { status: 404 });
      case 'PUT':
        if (id === 'read') {
          this.state.notifications.forEach(n => n.isRead = true);
          await this.persist();
          return Response.json({ success: true, data: this.state.notifications });
        }
        return new Response('Not Found', { status: 404 });
      default:
        return new Response('Method Not Allowed', { status: 405 });
    }
  }
  private generateNotifications(): Notification[] {
    const generated: Notification[] = [];
    const now = new Date();
    // 1. Stale deal reminders
    const staleThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    this.state.deals.forEach(deal => {
      if (deal.stage !== 'Closed-Won' && deal.stage !== 'Closed-Lost') {
        const lastActivity = this.state.activities
          .filter(a => a.dealId === deal.id)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        if (!lastActivity || new Date(lastActivity.date) < staleThreshold) {
          const message = `Deal "${deal.title}" has been inactive for over a week. Consider a follow-up.`;
          if (!this.state.notifications.some(n => n.dealId === deal.id && n.type === 'reminder' && !n.isRead)) {
            generated.push({ id: `notif-${Date.now()}-${Math.random()}`, type: 'reminder', message, isRead: false, createdAt: now.toISOString(), dealId: deal.id });
          }
        }
      }
    });
    // 2. Proactive suggestions
    const highValueDeals = this.state.deals.filter(d => d.value > 100000 && d.stage === 'Proposal');
    if (highValueDeals.length > 0 && !this.state.notifications.some(n => n.type === 'suggestion' && !n.isRead)) {
      generated.push({ id: `notif-${Date.now()}-${Math.random()}`, type: 'suggestion', message: `You have ${highValueDeals.length} high-value deals in the proposal stage. Ensure you have clear next steps defined.`, isRead: false, createdAt: now.toISOString() });
    }
    // 3. AI advice
    if (this.state.deals.filter(d => d.stage === 'Closed-Won').length > 3 && !this.state.notifications.some(n => n.type === 'ai_advice' && !n.isRead)) {
      generated.push({ id: `notif-${Date.now()}-${Math.random()}`, type: 'ai_advice', message: `Great work on recent wins! Analyze what worked and apply it to your current pipeline.`, isRead: false, createdAt: now.toISOString() });
    }
    return generated;
  }
  private async convertLead(leadId: string): Promise<any> {
    const leadIndex = this.state.leads.findIndex(l => l.id === leadId);
    if (leadIndex === -1) throw new Error('Lead not found');
    const lead = this.state.leads[leadIndex];
    let company = this.state.companies.find(c => c.name.toLowerCase() === lead.companyName.toLowerCase());
    if (!company) {
      company = {
        id: `comp-${Date.now()}`,
        name: lead.companyName,
        industry: 'Unknown',
        employees: 1,
        location: lead.location,
        logoUrl: `https://logo.clearbit.com/${lead.companyName.toLowerCase().replace(/ /g, '')}.com`,
      };
      this.state.companies.unshift(company);
    }
    const contact = {
      id: `contact-${Date.now()}`,
      name: lead.name,
      email: lead.email,
      title: lead.title,
      companyId: company.id,
      lastContacted: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/8.x/avataaars/svg?seed=${lead.name}`,
    };
    this.state.contacts.unshift(contact);
    const deal = {
      id: `deal-${Date.now()}`,
      title: `${lead.companyName} - Initial Deal`,
      value: 10000,
      stage: 'Qualified' as const,
      companyId: company.id,
      contactId: contact.id,
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    this.state.deals.unshift(deal);
    this.state.leads.splice(leadIndex, 1);
    await this.persist();
    return { company, contact, deal };
  }
}