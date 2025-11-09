import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Lead, Contact, Company, Deal, ICP } from '@/lib/types';
import { LEADS, CONTACTS, COMPANIES, DEALS, ICPS } from '@/lib/mock-data';
interface CrmState {
  leads: Lead[];
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  icps: ICP[];
  addLeads: (newLeads: Lead[]) => void;
  deleteLead: (leadId: string) => void;
  convertLead: (leadId: string) => void;
  addContact: (contact: Contact) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (contactId: string) => void;
  addCompany: (company: Company) => void;
  updateCompany: (company: Company) => void;
  deleteCompany: (companyId: string) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (deal: Deal) => void;
  deleteDeal: (dealId: string) => void;
  setDeals: (deals: Deal[]) => void;
  addIcp: (icp: ICP) => void;
  updateIcp: (icp: ICP) => void;
  deleteIcp: (icpId: string) => void;
}
export const useCrmStore = create<CrmState>()(
  immer((set) => ({
    leads: LEADS,
    contacts: CONTACTS,
    companies: COMPANIES,
    deals: DEALS,
    icps: ICPS,
    addLeads: (newLeads) =>
      set((state) => {
        state.leads.unshift(...newLeads);
      }),
    deleteLead: (leadId) =>
      set((state) => {
        state.leads = state.leads.filter((l) => l.id !== leadId);
      }),
    convertLead: (leadId) =>
      set((state) => {
        const lead = state.leads.find((l) => l.id === leadId);
        if (!lead) return;
        // 1. Create Company
        let company = state.companies.find(c => c.name.toLowerCase() === lead.companyName.toLowerCase());
        if (!company) {
          company = {
            id: `comp-${Date.now()}`,
            name: lead.companyName,
            industry: 'Unknown',
            employees: 1,
            location: lead.location,
            logoUrl: `https://logo.clearbit.com/${lead.companyName.toLowerCase().replace(/ /g, '')}.com`,
          };
          state.companies.unshift(company);
        }
        // 2. Create Contact
        const contact = {
          id: `contact-${Date.now()}`,
          name: lead.name,
          email: lead.email,
          title: lead.title,
          companyId: company.id,
          lastContacted: new Date().toISOString(),
          avatarUrl: `https://api.dicebear.com/8.x/avataaars/svg?seed=${lead.name}`,
        };
        state.contacts.unshift(contact);
        // 3. Create Deal
        const deal = {
          id: `deal-${Date.now()}`,
          title: `${lead.companyName} - Initial Deal`,
          value: 10000, // Default value
          stage: 'Qualified' as const,
          companyId: company.id,
          contactId: contact.id,
          closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        state.deals.unshift(deal);
        // 4. Remove Lead
        state.leads = state.leads.filter((l) => l.id !== leadId);
      }),
    addContact: (contact) => set((state) => { state.contacts.unshift(contact); }),
    updateContact: (contact) => set((state) => {
      const index = state.contacts.findIndex(c => c.id === contact.id);
      if (index !== -1) state.contacts[index] = contact;
    }),
    deleteContact: (contactId) => set((state) => {
      state.contacts = state.contacts.filter(c => c.id !== contactId);
    }),
    addCompany: (company) => set((state) => { state.companies.unshift(company); }),
    updateCompany: (company) => set((state) => {
      const index = state.companies.findIndex(c => c.id === company.id);
      if (index !== -1) state.companies[index] = company;
    }),
    deleteCompany: (companyId) => set((state) => {
      state.companies = state.companies.filter(c => c.id !== companyId);
    }),
    addDeal: (deal) => set((state) => { state.deals.unshift(deal); }),
    updateDeal: (deal) => set((state) => {
      const index = state.deals.findIndex(d => d.id === deal.id);
      if (index !== -1) state.deals[index] = deal;
    }),
    deleteDeal: (dealId) => set((state) => {
      state.deals = state.deals.filter(d => d.id !== dealId);
    }),
    setDeals: (deals) => set((state) => { state.deals = deals; }),
    addIcp: (icp) => set((state) => { state.icps.unshift(icp); }),
    updateIcp: (icp) => set((state) => {
      const index = state.icps.findIndex(i => i.id === icp.id);
      if (index !== -1) state.icps[index] = icp;
    }),
    deleteIcp: (icpId) => set((state) => {
      state.icps = state.icps.filter(i => i.id !== icpId);
    }),
  }))
);