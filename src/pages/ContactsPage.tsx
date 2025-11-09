import React, { useState } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Contact } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { CreateContactModal } from '@/components/contacts/CreateContactModal';
import { EditContactModal } from '@/components/contacts/EditContactModal';
import { Header } from '@/components/layout/Header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCrmStore } from '@/stores/crm-store';
import { Toaster, toast } from 'sonner';
import { ContactDetailSheet } from '@/components/contacts/ContactDetailSheet';
export function ContactsPage() {
  const contacts = useCrmStore(s => s.contacts);
  const companies = useCrmStore(s => s.companies);
  const addContact = useCrmStore(s => s.addContact);
  const updateContact = useCrmStore(s => s.updateContact);
  const deleteContact = useCrmStore(s => s.deleteContact);
  const isLoading = useCrmStore(s => s.isLoading);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleContactCreated = async (newContact: Contact) => {
    const promise = addContact(newContact);
    toast.promise(promise, {
      loading: 'Creating contact...',
      success: 'Contact created successfully!',
      error: 'Failed to create contact.',
    });
  };
  const handleUpdateContact = async (updatedContact: Contact) => {
    const promise = updateContact(updatedContact);
    toast.promise(promise, {
      loading: 'Updating contact...',
      success: 'Contact updated successfully!',
      error: 'Failed to update contact.',
    });
  };
  const handleDeleteContact = (contactId: string) => {
    const promise = deleteContact(contactId);
    toast.promise(promise, {
      loading: 'Deleting contact...',
      success: 'Contact deleted.',
      error: 'Failed to delete contact.',
    });
  };
  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };
  const handleRowClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsSheetOpen(true);
  };
  const selectedCompany = selectedContact ? companies.find(c => c.id === selectedContact.companyId) : null;
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
      cell: (item: Contact) => companies.find(c => c.id === item.companyId)?.name || 'N/A',
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
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteContact(item.id); }} className="text-red-500">
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
      <Toaster richColors theme="dark" />
      <Header onNewContact={() => setIsCreateModalOpen(true)}>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Contact
        </Button>
      </Header>
      <div className="p-4 md:p-8">
        <DataTable data={contacts} columns={columns} isLoading={isLoading} onRowClick={handleRowClick} />
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
      <ContactDetailSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        contact={selectedContact}
        company={selectedCompany}
      />
    </>
  );
}