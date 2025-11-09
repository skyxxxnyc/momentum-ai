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
export function DealsPage() {
  const deals = useCrmStore(s => s.deals);
  const setDeals = useCrmStore(s => s.setDeals);
  const contacts = useCrmStore(s => s.contacts);
  const companies = useCrmStore(s => s.companies);
  const addDeal = useCrmStore(s => s.addDeal);
  const updateDeal = useCrmStore(s => s.updateDeal);
  const deleteDeal = useCrmStore(s => s.deleteDeal);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleSelectDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsSheetOpen(true);
  };
  const handleUpdateDeal = (updatedDeal: Deal) => {
    updateDeal(updatedDeal);
    if (selectedDeal?.id === updatedDeal.id) {
      setSelectedDeal(updatedDeal);
    }
  };
  const handleDeleteDeal = (dealId: string) => {
    deleteDeal(dealId);
    setIsSheetOpen(false);
    setSelectedDeal(null);
  };
  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsEditModalOpen(true);
  };
  const selectedContact = selectedDeal ? contacts.find(c => c.id === selectedDeal.contactId) || null : null;
  const selectedCompany = selectedDeal ? companies.find(c => c.id === selectedDeal.companyId) || null : null;
  return (
    <div className="h-full flex flex-col">
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
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        deal={selectedDeal}
        contact={selectedContact}
        company={selectedCompany}
        onEdit={handleEditDeal}
        onDelete={handleDeleteDeal}
      />
      <CreateDealModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onDealCreated={addDeal}
      />
      <EditDealModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        deal={selectedDeal}
        onDealUpdated={handleUpdateDeal}
      />
    </div>
  );
}