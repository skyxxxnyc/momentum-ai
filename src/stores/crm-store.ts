import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Lead, Contact, Company, Deal, ICP, Article, Activity, Notification } from '@/lib/types';
import apiService from '@/lib/api';
interface CrmState {
  leads: Lead[];
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  icps: ICP[];
  articles: Article[];
  activities: Activity[];
  notifications: Notification[];
  isLoading: boolean;
  selectedDealId: string | null;
  initialize: () => Promise<void>;
  setSelectedDealId: (dealId: string | null) => void;
  addLeads: (newLeads: Lead[]) => void;
  deleteLead: (leadId: string) => Promise<void>;
  convertLead: (leadId: string) => Promise<void>;
  addContact: (contact: Contact) => Promise<void>;
  updateContact: (contact: Contact) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
  addCompany: (company: Company) => Promise<void>;
  updateCompany: (company: Company) => Promise<void>;
  deleteCompany: (companyId: string) => Promise<void>;
  addDeal: (deal: Deal) => Promise<void>;
  updateDeal: (deal: Deal) => Promise<void>;
  deleteDeal: (dealId: string) => Promise<void>;
  setDeals: (deals: Deal[]) => void;
  addIcp: (icp: ICP) => Promise<void>;
  updateIcp: (icp: ICP) => Promise<void>;
  deleteIcp: (icpId: string) => Promise<void>;
  addArticle: (article: Article) => Promise<void>;
  updateArticle: (article: Article) => Promise<void>;
  deleteArticle: (articleId: string) => Promise<void>;
  addActivity: (activity: Activity) => Promise<void>;
  generateNotifications: () => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}
export const useCrmStore = create<CrmState>()(
  immer((set, get) => ({
    leads: [],
    contacts: [],
    companies: [],
    deals: [],
    icps: [],
    articles: [],
    activities: [],
    notifications: [],
    isLoading: true,
    selectedDealId: null,
    initialize: async () => {
      set({ isLoading: true });
      try {
        const [contacts, companies, deals, icps, leads, articles, activities, notifications] = await Promise.all([
          apiService.getAll<Contact>('contacts'),
          apiService.getAll<Company>('companies'),
          apiService.getAll<Deal>('deals'),
          apiService.getAll<ICP>('icps'),
          apiService.getAll<Lead>('leads'),
          apiService.getAll<Article>('articles'),
          apiService.getAll<Activity>('activities'),
          apiService.getNotifications(),
        ]);
        set({ contacts, companies, deals, icps, leads, articles, activities, notifications, isLoading: false });
      } catch (error) {
        console.error("Failed to initialize CRM store:", error);
        set({ isLoading: false });
      }
    },
    setSelectedDealId: (dealId) => set({ selectedDealId: dealId }),
    addLeads: (newLeads) => set((state) => { state.leads.unshift(...newLeads); }),
    deleteLead: async (leadId) => {
      await apiService.delete('leads', leadId);
      set((state) => { state.leads = state.leads.filter((l) => l.id !== leadId); });
    },
    convertLead: async (leadId) => {
      const { contact, company, deal } = await apiService.convertLead(leadId);
      set((state) => {
        state.leads = state.leads.filter((l) => l.id !== leadId);
        state.contacts.unshift(contact);
        state.companies.unshift(company);
        state.deals.unshift(deal);
      });
    },
    addContact: async (contact) => {
      const newContact = await apiService.create('contacts', contact);
      set((state) => { state.contacts.unshift(newContact); });
    },
    updateContact: async (contact) => {
      const updatedContact = await apiService.update('contacts', contact);
      set((state) => {
        const index = state.contacts.findIndex(c => c.id === updatedContact.id);
        if (index !== -1) state.contacts[index] = updatedContact;
      });
    },
    deleteContact: async (contactId) => {
      await apiService.delete('contacts', contactId);
      set((state) => { state.contacts = state.contacts.filter(c => c.id !== contactId); });
    },
    addCompany: async (company) => {
      const newCompany = await apiService.create('companies', company);
      set((state) => { state.companies.unshift(newCompany); });
    },
    updateCompany: async (company) => {
      const updatedCompany = await apiService.update('companies', company);
      set((state) => {
        const index = state.companies.findIndex(c => c.id === updatedCompany.id);
        if (index !== -1) state.companies[index] = updatedCompany;
      });
    },
    deleteCompany: async (companyId) => {
      await apiService.delete('companies', companyId);
      set((state) => { state.companies = state.companies.filter(c => c.id !== companyId); });
    },
    addDeal: async (deal) => {
      const newDeal = await apiService.create('deals', deal);
      set((state) => { state.deals.unshift(newDeal); });
    },
    updateDeal: async (deal) => {
      const updatedDeal = await apiService.update('deals', deal);
      set((state) => {
        const index = state.deals.findIndex(d => d.id === updatedDeal.id);
        if (index !== -1) state.deals[index] = updatedDeal;
      });
    },
    deleteDeal: async (dealId) => {
      await apiService.delete('deals', dealId);
      set((state) => { state.deals = state.deals.filter(d => d.id !== dealId); });
    },
    setDeals: (deals) => set({ deals }),
    addIcp: async (icp) => {
      const newIcp = await apiService.create('icps', icp);
      set((state) => { state.icps.unshift(newIcp); });
    },
    updateIcp: async (icp) => {
      const updatedIcp = await apiService.update('icps', icp);
      set((state) => {
        const index = state.icps.findIndex(i => i.id === updatedIcp.id);
        if (index !== -1) state.icps[index] = updatedIcp;
      });
    },
    deleteIcp: async (icpId) => {
      await apiService.delete('icps', icpId);
      set((state) => { state.icps = state.icps.filter(i => i.id !== icpId); });
    },
    addArticle: async (article) => {
      const newArticle = await apiService.create('articles', article);
      set((state) => { state.articles.unshift(newArticle); });
    },
    updateArticle: async (article) => {
      const updatedArticle = await apiService.update('articles', article);
      set((state) => {
        const index = state.articles.findIndex(a => a.id === updatedArticle.id);
        if (index !== -1) state.articles[index] = updatedArticle;
      });
    },
    deleteArticle: async (articleId) => {
      await apiService.delete('articles', articleId);
      set((state) => { state.articles = state.articles.filter(a => a.id !== articleId); });
    },
    addActivity: async (activity) => {
      const newActivity = await apiService.create('activities', activity);
      set((state) => { state.activities.unshift(newActivity); });
    },
    generateNotifications: async () => {
      const newNotifications = await apiService.generateNotifications();
      set(state => {
        state.notifications.unshift(...newNotifications);
      });
    },
    markAllNotificationsAsRead: async () => {
      const updatedNotifications = await apiService.markAllNotificationsAsRead();
      set({ notifications: updatedNotifications });
    },
  }))
);