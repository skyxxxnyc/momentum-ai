import React from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { CONTACTS, COMPANIES } from '@/lib/mock-data';
import { Contact } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
export function ContactsPage() {
  const columns = [
    {
      accessor: 'name' as keyof Contact,
      header: 'Name',
      cell: (item: Contact) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.avatarUrl} alt={item.name} />
            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    { accessor: 'email' as keyof Contact, header: 'Email' },
    { accessor: 'title' as keyof Contact, header: 'Title' },
    {
      accessor: 'companyId' as keyof Contact,
      header: 'Company',
      cell: (item: Contact) => COMPANIES.find(c => c.id === item.companyId)?.name || 'N/A',
    },
    {
      accessor: 'lastContacted' as keyof Contact,
      header: 'Last Contacted',
      cell: (item: Contact) => new Date(item.lastContacted).toLocaleDateString(),
    },
  ];
  return (
    <div className="p-4 md:p-8">
      <DataTable data={CONTACTS} columns={columns} />
    </div>
  );
}