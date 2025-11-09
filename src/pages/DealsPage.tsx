import React, { useState } from 'react';
import { KanbanBoard } from '@/components/deals/KanbanBoard';
import { DealDetailSheet } from '@/components/deals/DealDetailSheet';
import { DEALS, CONTACTS, COMPANIES } from '@/lib/mock-data';
import { Deal, Contact, Company } from '@/lib/types';
export function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(DEALS);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleSelectDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsSheetOpen(true);
  };
  const selectedContact = selectedDeal ? CONTACTS.find(c => c.id === selectedDeal.contactId) || null : null;
  const selectedCompany = selectedDeal ? COMPANIES.find(c => c.id === selectedDeal.companyId) || null : null;
  return (
    <div className="h-full">
      <KanbanBoard
        deals={deals}
        setDeals={setDeals}
        contacts={CONTACTS}
        companies={COMPANIES}
        onSelectDeal={handleSelectDeal}
      />
      <DealDetailSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        deal={selectedDeal}
        contact={selectedContact}
        company={selectedCompany}
      />
    </div>
  );
}