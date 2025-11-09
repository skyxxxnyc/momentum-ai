import { Contact, Company, Deal, ICP, Lead, Article, Notification, Activity, Comment, User } from './types';
type CrmEntity = Contact | Company | Deal | ICP | Lead | Article | Activity | Notification | Comment | User;
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'API operation failed');
  }
  return result.data;
};
const apiService = {
  getAll: async <T>(entity: string): Promise<T[]> => {
    const response = await fetch(`/api/${entity}`);
    return handleResponse(response);
  },
  create: async <T extends { id: string }>(entity: string, data: T): Promise<T> => {
    const response = await fetch(`/api/${entity}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  update: async <T extends { id: string }>(entity: string, data: T): Promise<T> => {
    const response = await fetch(`/api/${entity}/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  delete: async (entity: string, id: string): Promise<{ id: string }> => {
    const response = await fetch(`/api/${entity}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
  convertLead: async (leadId: string): Promise<{ contact: Contact, company: Company, deal: Deal }> => {
    const response = await fetch(`/api/leads/${leadId}/convert`, {
      method: 'POST',
    });
    return handleResponse(response);
  },
  generateNotifications: async (): Promise<Notification[]> => {
    const response = await fetch('/api/notifications/generate', { method: 'POST' });
    return handleResponse(response);
  },
  getNotifications: async (): Promise<Notification[]> => {
    return apiService.getAll<Notification>('notifications');
  },
  markAllNotificationsAsRead: async (): Promise<Notification[]> => {
    const response = await fetch('/api/notifications/read', { method: 'PUT' });
    return handleResponse(response);
  },
};
export default apiService;