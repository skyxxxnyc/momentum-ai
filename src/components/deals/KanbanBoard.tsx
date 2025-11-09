import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Deal, Stage, Contact, Company } from '@/lib/types';
import { STAGES } from '@/lib/mock-data';
interface DealCardProps {
  deal: Deal;
  contact?: Contact;
  company?: Company;
}
function DealCard({ deal, contact, company }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: deal.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4 bg-accent cursor-grab active:cursor-grabbing">
      <CardContent className="p-4">
        <h4 className="font-semibold text-momentum-slate">{deal.title}</h4>
        <p className="text-sm text-momentum-dark-slate">{company?.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-momentum-cyan">
            ${deal.value.toLocaleString()}
          </span>
          {contact && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={contact.avatarUrl} alt={contact.name} />
              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
interface KanbanColumnProps {
  stage: Stage;
  deals: Deal[];
  contacts: Contact[];
  companies: Company[];
}
function KanbanColumn({ stage, deals, contacts, companies }: KanbanColumnProps) {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  return (
    <div className="w-80 flex-shrink-0">
      <Card className="border-0 bg-transparent">
        <CardHeader className="px-2 py-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md font-semibold text-momentum-slate flex items-center gap-2">
              {stage} <Badge variant="secondary">{deals.length}</Badge>
            </CardTitle>
            <span className="text-sm font-medium text-momentum-dark-slate">
              ${(totalValue / 1000).toFixed(0)}k
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-2 h-[calc(100vh-20rem)] overflow-y-auto">
          <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
            {deals.map(deal => {
              const contact = contacts.find(c => c.id === deal.contactId);
              const company = companies.find(c => c.id === deal.companyId);
              return <DealCard key={deal.id} deal={deal} contact={contact} company={company} />;
            })}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}
interface KanbanBoardProps {
  deals: Deal[];
  contacts: Contact[];
  companies: Company[];
}
export function KanbanBoard({ deals: initialDeals, contacts, companies }: KanbanBoardProps) {
  const [deals, setDeals] = useState(initialDeals);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // This is a simplified drag-and-drop logic.
      // A full implementation would handle moving between columns.
      // For now, we'll just reorder within the same column.
      const activeDeal = deals.find(d => d.id === active.id);
      if (activeDeal) {
        // A more robust solution would find the column of `over.id`
        // and update the stage of `activeDeal`.
        console.log(`Deal ${active.id} was dropped over ${over.id}. Implement stage change logic here.`);
      }
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="flex gap-6 p-4 md:p-8 overflow-x-auto">
        {STAGES.map(stage => (
          <KanbanColumn
            key={stage}
            stage={stage}
            deals={deals.filter(d => d.stage === stage)}
            contacts={contacts}
            companies={companies}
          />
        ))}
      </div>
    </DndContext>
  );
}