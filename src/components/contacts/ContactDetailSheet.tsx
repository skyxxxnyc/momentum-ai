import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Contact, Company } from '@/lib/types';
import { Mail, Phone, StickyNote, Briefcase, Building, User, Calendar } from 'lucide-react';
import { useCrmStore } from '@/stores/crm-store';
import { LogActivityForm } from '../shared/LogActivityForm';
interface ContactDetailSheetProps {
  contact: Contact | null;
  company: Company | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
const activityIcons = {
  Email: Mail,
  Call: Phone,
  Meeting: Briefcase,
  Note: StickyNote,
};
export function ContactDetailSheet({ contact, company, isOpen, onOpenChange }: ContactDetailSheetProps) {
  const activities = useCrmStore(s => s.activities);
  if (!contact) return null;
  const contactActivities = activities.filter(a => a.contactId === contact.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-card border-l border-border/50 text-momentum-slate p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 text-left">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={contact.avatarUrl} alt={contact.name} />
              <AvatarFallback className="text-2xl">{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-2xl font-bold text-momentum-slate">{contact.name}</SheetTitle>
              <SheetDescription className="text-momentum-dark-slate">{contact.title}</SheetDescription>
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
              <h3 className="font-semibold text-momentum-light-slate">Contact Information</h3>
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                <a href={`mailto:${contact.email}`} className="hover:text-momentum-cyan transition-colors">{contact.email}</a>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                <span className="text-momentum-dark-slate mr-2">Last Contacted:</span>
                <span>{new Date(contact.lastContacted).toLocaleDateString()}</span>
              </div>
            </div>
            <Separator />
            {company && (
              <div className="space-y-4">
                <h3 className="font-semibold text-momentum-light-slate">Company</h3>
                <div className="flex items-center text-sm">
                  <Building className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                   <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={company.logoUrl} />
                      <AvatarFallback>{company.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                  <span className="font-semibold">{company.name}</span>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="activity" className="flex-1 overflow-y-auto p-6">
            <LogActivityForm contactId={contact.id} companyId={contact.companyId} />
            <Separator className="my-6" />
            <div className="space-y-6">
              {contactActivities.length > 0 ? contactActivities.map(activity => {
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
                <p className="text-center text-sm text-momentum-dark-slate py-8">No activity recorded for this contact.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}