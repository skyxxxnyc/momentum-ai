import React, { useState } from 'react';
import { KanbanBoard } from '@/components/deals/KanbanBoard';
import { DealDetailSheet } from '@/components/deals/DealDetailSheet';
import { CreateDealModal } from '@/components/deals/CreateDealModal';
import { DEALS, CONTACTS, COMPANIES } from '@/lib/mock-data';
import { Deal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
export function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(DEALS);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleSelectDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsSheetOpen(true);
  };
  const handleDealCreated = (newDeal: Deal) => {
    setDeals(prevDeals => [newDeal, ...prevDeals]);
  };
  const selectedContact = selectedDeal ? CONTACTS.find(c => c.id === selectedDeal.contactId) || null : null;
  const selectedCompany = selectedDeal ? COMPANIES.find(c => c.id === selectedDeal.companyId) || null : null;
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
          contacts={CONTACTS}
          companies={COMPANIES}
          onSelectDeal={handleSelectDeal}
        />
      </div>
      <DealDetailSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        deal={selectedDeal}
        contact={selectedContact}
        company={selectedCompany}
      />
      <CreateDealModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onDealCreated={handleDealCreated}
      />
    </div>
  );
}