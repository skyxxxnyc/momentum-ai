import { DurableObject } from 'cloudflare:workers';
import type { Env } from './core-utils';
import { Contact, Company, Deal, ICP, Lead } from '../src/lib/types';
import { CONTACTS, COMPANIES, DEALS, ICPS, LEADS } from '../src/lib/mock-data';
type CrmEntity = 'contacts' | 'companies' | 'deals' | 'icps' | 'leads';
type CrmData = Contact | Company | Deal | ICP | Lead;
interface CrmStorage {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  icps: ICP[];
  leads: Lead[];
}
export class AppController extends DurableObject<Env> {
  private state: CrmStorage = {
    contacts: [],
    companies: [],
    deals: [],
    icps: [],
    leads: [],
  };
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const stored = await this.ctx.storage.get<CrmStorage>('crm_data');
      if (stored && stored.contacts?.length > 0) {
        this.state = stored;
      } else {
        // First-time initialization with mock data
        this.state = {
          contacts: CONTACTS,
          companies: COMPANIES,
          deals: DEALS,
          icps: ICPS,
          leads: LEADS,
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
      switch (request.method) {
        case 'GET':
          return Response.json({ success: true, data: this.state[entityKey] || [] });
        case 'POST':
          if (action === 'convert' && entityKey === 'leads') {
            const result = await this.convertLead(id);
            return Response.json({ success: true, data: result });
          }
          const newData = await request.json<CrmData>();
          this.state[entityKey].unshift(newData as any);
          await this.persist();
          return Response.json({ success: true, data: newData });
        case 'PUT':
          const updatedData = await request.json<CrmData>();
          const index = this.state[entityKey].findIndex((item: CrmData) => item.id === id);
          if (index === -1) return new Response('Not Found', { status: 404 });
          this.state[entityKey][index] = updatedData as any;
          await this.persist();
          return Response.json({ success: true, data: updatedData });
        case 'DELETE':
          const initialLength = this.state[entityKey].length;
          this.state[entityKey] = this.state[entityKey].filter((item: CrmData) => item.id !== id) as any;
          if (this.state[entityKey].length === initialLength) return new Response('Not Found', { status: 404 });
          await this.persist();
          return Response.json({ success: true, data: { id } });
        default:
          return new Response('Method Not Allowed', { status: 405 });
      }
    } catch (error) {
      console.error(`Error in AppController for ${entity}:`, error);
      return new Response('Internal Server Error', { status: 500 });
    }
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