import React, { useState } from 'react';
import { KanbanBoard } from '@/components/deals/KanbanBoard';
import { DealDetailSheet } from '@/components/deals/DealDetailSheet';
import { CreateDealModal } from '@/components/deals/CreateDealModal';
import { EditDealModal } from '@/components/deals/EditDealModal';
import { Deal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useCrmStore } from '@/stores/crm-store';
import { Toaster, toast } from 'sonner';
export function DealsPage() {
  const deals = useCrmStore(s => s.deals);
  const setDeals = useCrmStore(s => s.setDeals);
  const contacts = useCrmStore(s => s.contacts);
  const companies = useCrmStore(s => s.companies);
  const addDeal = useCrmStore(s => s.addDeal);
  const updateDeal = useCrmStore(s => s.updateDeal);
  const deleteDeal = useCrmStore(s => s.deleteDeal);
  const selectedDealId = useCrmStore(s => s.selectedDealId);
  const setSelectedDealId = useCrmStore(s => s.setSelectedDealId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);
  const selectedDeal = deals.find(d => d.id === selectedDealId) || null;
  const handleSelectDeal = (deal: Deal) => {
    setSelectedDealId(deal.id);
  };
  const handleDealCreated = async (newDeal: Deal) => {
    const promise = addDeal(newDeal);
    toast.promise(promise, {
      loading: 'Creating deal...',
      success: 'Deal created successfully!',
      error: 'Failed to create deal.',
    });
  };
  const handleUpdateDeal = async (updatedDeal: Deal) => {
    const promise = updateDeal(updatedDeal);
    toast.promise(promise, {
      loading: 'Updating deal...',
      success: 'Deal updated successfully!',
      error: 'Failed to update deal.',
    });
  };
  const handleDeleteDeal = async (dealId: string) => {
    const promise = deleteDeal(dealId);
    toast.promise(promise, {
      loading: 'Deleting deal...',
      success: 'Deal deleted.',
      error: 'Failed to delete deal.',
    });
    setSelectedDealId(null);
  };
  const handleEditDeal = (deal: Deal) => {
    setDealToEdit(deal);
    setIsEditModalOpen(true);
  };
  const selectedContact = selectedDeal ? contacts.find(c => c.id === selectedDeal.contactId) || null : null;
  const selectedCompany = selectedDeal ? companies.find(c => c.id === selectedDeal.companyId) || null : null;
  return (
    <div className="h-full flex flex-col">
      <Toaster richColors theme="dark" />
      <Header>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </Header>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          deals={deals}
          setDeals={setDeals}
          contacts={contacts}
          companies={companies}
          onSelectDeal={handleSelectDeal}
        />
      </div>
      <DealDetailSheet
        isOpen={!!selectedDealId}
        onOpenChange={(open) => !open && setSelectedDealId(null)}
        deal={selectedDeal}
        contact={selectedContact}
        company={selectedCompany}
        onEdit={handleEditDeal}
        onDelete={handleDeleteDeal}
      />
      <CreateDealModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onDealCreated={handleDealCreated}
      />
      <EditDealModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        deal={dealToEdit}
        onDealUpdated={handleUpdateDeal}
      />
    </div>
  );
}