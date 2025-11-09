import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Deal, Contact, Company } from '@/lib/types';
import { MessageSquarePlus, DollarSign, Calendar, User, Building, Mail, Phone, StickyNote, Briefcase, Edit, Trash2 } from 'lucide-react';
import { AiActionModal } from '../shared/AiActionModal';
import { chatService } from '@/lib/chat';
import { ACTIVITIES } from '@/lib/mock-data';
interface DealDetailSheetProps {
  deal: Deal | null;
  contact: Contact | null;
  company: Company | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
}
const activityIcons = {
  Email: Mail,
  Call: Phone,
  Meeting: Briefcase,
  Note: StickyNote,
};
export function DealDetailSheet({ deal, contact, company, isOpen, onOpenChange, onEdit, onDelete }: DealDetailSheetProps) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const handleDraftEmail = async () => {
    if (!deal || !contact || !company) return;
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiContent('');
    const prompt = `Draft a professional follow-up email to ${contact.name} (${contact.title} at ${company.name}) regarding the "${deal.title}" deal, which is currently in the '${deal.stage}' stage. The deal value is ${deal.value}. Keep it concise and aim to move the deal to the next stage.`;
    await chatService.sendMessage(prompt, undefined, (chunk) => {
      setAiContent(prev => prev + chunk);
    });
    setIsAiLoading(false);
  };
  if (!deal) return null;
  const dealActivities = ACTIVITIES.filter(a => a.dealId === deal.id);
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-card border-l border-border/50 text-momentum-slate p-0 flex flex-col">
          <SheetHeader className="p-6 pb-0">
            <div className="flex justify-between items-start">
              <div>
                <SheetTitle className="text-2xl font-bold text-momentum-slate">{deal.title}</SheetTitle>
                <SheetDescription className="text-momentum-dark-slate">
                  {company?.name} • Stage: <span className="text-momentum-cyan">{deal.stage}</span>
                </SheetDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(deal)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(deal.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>
          <Tabs defaultValue="details" className="w-full flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mt-4 px-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="flex-1 overflow-y-auto p-6 space-y-6">
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
                  <Button variant="outline" className="w-full justify-start gap-2 text-momentum-cyan border-momentum-cyan/50 hover:bg-momentum-cyan/10 hover:text-momentum-cyan" onClick={handleDraftEmail}>
                      <MessageSquarePlus className="w-4 h-4" />
                      Draft Follow-up Email
                  </Button>
               </div>
            </TabsContent>
            <TabsContent value="activity" className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {dealActivities.length > 0 ? dealActivities.map(activity => {
                  const Icon = activityIcons[activity.type];
                  return (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="bg-accent rounded-full p-2">
                          <Icon className="w-4 h-4 text-momentum-dark-slate" />
                        </div>
                        <div className="w-px flex-1 bg-border/50 my-2"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-momentum-light-slate">{activity.type}: {activity.subject}</p>
                        <p className="text-xs text-momentum-dark-slate">{new Date(activity.date).toLocaleString()}</p>
                      </div>
                    </div>
                  )
                }) : (
                  <p className="text-center text-sm text-momentum-dark-slate py-8">No activity recorded for this deal.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
      <AiActionModal
        isOpen={isAiModalOpen}
        onOpenChange={setIsAiModalOpen}
        title="Draft Follow-up Email"
        isLoading={isAiLoading}
        content={aiContent}
        onRegenerate={handleDraftEmail}
      />
    </>
  );
}