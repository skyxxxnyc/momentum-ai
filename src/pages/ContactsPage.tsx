import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { CONTACTS, COMPANIES } from '@/lib/mock-data';
import { Contact } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { CreateContactModal } from '@/components/contacts/CreateContactModal';
import { EditContactModal } from '@/components/contacts/EditContactModal';
import { Header } from '@/components/layout/Header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts(CONTACTS);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const handleContactCreated = (newContact: Contact) => {
    setContacts(prev => [newContact, ...prev]);
  };
  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
  };
  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };
  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };
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
    {
      accessor: 'actions' as const,
      header: 'Actions',
      cell: (item: Contact) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditClick(item)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteContact(item.id)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return (
    <>
      <Header>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Contact
        </Button>
      </Header>
      <div className="p-4 md:p-8">
        <DataTable data={contacts} columns={columns} isLoading={isLoading} />
      </div>
      <CreateContactModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onContactCreated={handleContactCreated}
      />
      <EditContactModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        contact={selectedContact}
        onContactUpdated={handleUpdateContact}
      />
    </>
  );
}