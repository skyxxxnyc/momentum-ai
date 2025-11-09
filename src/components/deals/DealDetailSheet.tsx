import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Deal, Contact, Company } from '@/lib/types';
import { MessageSquarePlus, DollarSign, Calendar, User, Building } from 'lucide-react';
interface DealDetailSheetProps {
  deal: Deal | null;
  contact: Contact | null;
  company: Company | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
export function DealDetailSheet({ deal, contact, company, isOpen, onOpenChange }: DealDetailSheetProps) {
  if (!deal) return null;
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-card border-l border-border/50 text-momentum-slate p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6">
            <SheetTitle className="text-2xl font-bold text-momentum-slate">{deal.title}</SheetTitle>
            <SheetDescription className="text-momentum-dark-slate">
              {company?.name} • Stage: <span className="text-momentum-cyan">{deal.stage}</span>
            </SheetDescription>
          </SheetHeader>
          <Separator />
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-momentum-light-slate">Deal Details</h3>
              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                <span className="text-momentum-dark-slate mr-2">Value:</span>
                <span className="font-semibold text-momentum-cyan">${deal.value.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                <span className="text-momentum-dark-slate mr-2">Close Date:</span>
                <span>{new Date(deal.closeDate).toLocaleDateString()}</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold text-momentum-light-slate">Associated People & Places</h3>
              {contact && (
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={contact.avatarUrl} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{contact.name}</span>
                  <span className="text-momentum-dark-slate ml-2">({contact.title})</span>
                </div>
              )}
              {company && (
                 <div className="flex items-center text-sm">
                  <Building className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={company.logoUrl} />
                    <AvatarFallback>{company.name.substring(0,2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{company.name}</span>
                </div>
              )}
            </div>
            <Separator />
             <div className="space-y-4">
                <h3 className="font-semibold text-momentum-light-slate">AI Actions</h3>
                <Button variant="outline" className="w-full justify-start gap-2 text-momentum-cyan border-momentum-cyan/50 hover:bg-momentum-cyan/10 hover:text-momentum-cyan">
                    <MessageSquarePlus className="w-4 h-4" />
                    Draft Follow-up Email
                </Button>
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}