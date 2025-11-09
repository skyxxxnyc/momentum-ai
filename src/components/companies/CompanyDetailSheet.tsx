import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Company } from '@/lib/types';
import { Mail, Phone, StickyNote, Briefcase, Building, Users, MapPin, BarChart } from 'lucide-react';
import { useCrmStore } from '@/stores/crm-store';
interface CompanyDetailSheetProps {
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
export function CompanyDetailSheet({ company, isOpen, onOpenChange }: CompanyDetailSheetProps) {
  const activities = useCrmStore(s => s.activities);
  const contacts = useCrmStore(s => s.contacts);
  if (!company) return null;
  const companyActivities = activities.filter(a => a.companyId === company.id);
  const companyContacts = contacts.filter(c => c.companyId === company.id);
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-card border-l border-border/50 text-momentum-slate p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 text-left">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={company.logoUrl} alt={company.name} />
              <AvatarFallback className="text-2xl">{company.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-2xl font-bold text-momentum-slate">{company.name}</SheetTitle>
              <SheetDescription className="text-momentum-dark-slate">{company.industry}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <Tabs defaultValue="details" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mt-4 px-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="contacts">Contacts ({companyContacts.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-momentum-light-slate">Company Information</h3>
              <div className="flex items-center text-sm">
                <BarChart className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                <span className="text-momentum-dark-slate mr-2">Industry:</span>
                <span>{company.industry}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                <span className="text-momentum-dark-slate mr-2">Employees:</span>
                <span>{company.employees.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                <span className="text-momentum-dark-slate mr-2">Location:</span>
                <span>{company.location}</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="contacts" className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {companyContacts.length > 0 ? companyContacts.map(contact => (
                <div key={contact.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-momentum-slate">{contact.name}</p>
                    <p className="text-sm text-momentum-dark-slate">{contact.title}</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-sm text-momentum-dark-slate py-8">No contacts associated with this company.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="activity" className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {companyActivities.length > 0 ? companyActivities.map(activity => {
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
                <p className="text-center text-sm text-momentum-dark-slate py-8">No activity recorded for this company.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}