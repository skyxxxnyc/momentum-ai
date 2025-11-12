import React from 'react';
import { DndContext, closestCenter, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Deal, Stage, Contact, Company } from '@/lib/types';
import { STAGES } from '@/lib/mock-data';
import { createPortal } from 'react-dom';
import { Clock, Zap, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface DealCardProps {
  deal: Deal;
  contact?: Contact;
  company?: Company;
  isOverlay?: boolean;
  onClick: () => void;
}
const healthIcons = {
  on_track: { icon: ShieldCheck, color: 'text-green-400', label: 'On Track' },
  needs_attention: { icon: ShieldAlert, color: 'text-yellow-400', label: 'Needs Attention' },
  at_risk: { icon: ShieldX, color: 'text-red-400', label: 'At Risk' },
};
function DealCard({ deal, contact, company, isOverlay, onClick }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id, data: { stage: deal.stage } });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const getScoreColor = (score: number) => {
    if (score > 75) return 'bg-green-500';
    if (score > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const HealthIcon = deal.healthStatus ? healthIcons[deal.healthStatus].icon : null;
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`mb-4 bg-accent cursor-grab active:cursor-grabbing transition-shadow hover:shadow-lg ${isDragging ? 'opacity-50' : ''} ${isOverlay ? 'shadow-xl' : ''}`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-semibold text-momentum-slate">{deal.title}</h4>
                <p className="text-sm text-momentum-dark-slate">{company?.name}</p>
            </div>
            {HealthIcon && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HealthIcon className={cn("h-5 w-5", deal.healthStatus && healthIcons[deal.healthStatus].color)} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Health: {deal.healthStatus && healthIcons[deal.healthStatus].label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
        </div>
        <div className="flex items-center justify-between">
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
        {deal.momentumScore && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-momentum-dark-slate">
              <div className="flex items-center">
                <Zap className="w-3 h-3 mr-1.5" />
                <span>Momentum</span>
              </div>
              <span>{deal.momentumScore}</span>
            </div>
            <Progress value={deal.momentumScore} className={cn("h-1.5", getScoreColor(deal.momentumScore))} />
          </div>
        )}
        {deal.lastActivity && (
            <div className="flex items-center text-xs text-momentum-dark-slate">
                <Clock className="w-3 h-3 mr-1.5" />
                <span>Last activity: {deal.lastActivity}</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
interface KanbanColumnProps {
  stage: Stage;
  deals: Deal[];
  contacts: Contact[];
  companies: Company[];
  onSelectDeal: (deal: Deal) => void;
}
function KanbanColumn({ stage, deals, contacts, companies, onSelectDeal }: KanbanColumnProps) {
  const { setNodeRef } = useSortable({ id: stage });
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  return (
    <div ref={setNodeRef} className="w-80 flex-shrink-0">
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
          <SortableContext items={deals.map(d => d.id)}>
            {deals.map(deal => {
              const contact = contacts.find(c => c.id === deal.contactId);
              const company = companies.find(c => c.id === deal.companyId);
              return <DealCard key={deal.id} deal={deal} contact={contact} company={company} onClick={() => onSelectDeal(deal)} />;
            })}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}
interface KanbanBoardProps {
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  contacts: Contact[];
  companies: Company[];
  onSelectDeal: (deal: Deal) => void;
}
export function KanbanBoard({ deals, setDeals, contacts, companies, onSelectDeal }: KanbanBoardProps) {
  const [activeDeal, setActiveDeal] = React.useState<Deal | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find(d => d.id === active.id);
    if (deal) {
      setActiveDeal(deal);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);
    if (!over) return;
    const activeDeal = deals.find(d => d.id === active.id);
    if (!activeDeal) return;
    const overId = over.id;
    const overStage = STAGES.includes(overId as Stage)
      ? overId as Stage
      : deals.find(d => d.id === overId)?.stage;
    if (overStage && activeDeal.stage !== overStage) {
      setDeals(prevDeals => {
        const activeIndex = prevDeals.findIndex(d => d.id === active.id);
        if (activeIndex === -1) return prevDeals;
        const updatedDeal = { ...prevDeals[activeIndex], stage: overStage };
        const newDeals = [...prevDeals];
        newDeals[activeIndex] = updatedDeal;
        // This is a simplified reordering. A more complex logic would place it correctly in the new list.
        return newDeals;
      });
    } else if (active.id !== over.id) {
        // Reordering within the same column
        setDeals((items) => {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    }
  };
  const activeContact = activeDeal ? contacts.find(c => c.id === activeDeal.contactId) : undefined;
  const activeCompany = activeDeal ? companies.find(c => c.id === activeDeal.companyId) : undefined;
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
      <div className="flex gap-6 p-4 md:p-8 overflow-x-auto">
        <SortableContext items={STAGES}>
          {STAGES.map(stage => (
            <KanbanColumn
              key={stage}
              stage={stage}
              deals={deals.filter(d => d.stage === stage)}
              contacts={contacts}
              companies={companies}
              onSelectDeal={onSelectDeal}
            />
          ))}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay>
          {activeDeal ? (
            <DealCard
              deal={activeDeal}
              contact={activeContact}
              company={activeCompany}
              isOverlay
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}