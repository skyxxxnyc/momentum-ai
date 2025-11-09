import React from 'react';
import { KanbanBoard } from '@/components/deals/KanbanBoard';
import { DEALS, CONTACTS, COMPANIES } from '@/lib/mock-data';
export function DealsPage() {
  return (
    <div className="h-full">
      <KanbanBoard deals={DEALS} contacts={CONTACTS} companies={COMPANIES} />
    </div>
  );
}