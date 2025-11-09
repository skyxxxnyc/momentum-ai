import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Contact, Company } from '@/lib/types';
import { Mail, Phone, StickyNote, Briefcase, Building, User, Calendar, Zap, GitBranch } from 'lucide-react';
import { useCrmStore } from '@/stores/crm-store';
import { LogActivityForm } from '../shared/LogActivityForm';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
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
  const allContacts = useCrmStore(s => s.contacts);
  if (!contact) return null;
  const contactActivities = activities.filter(a => a.contactId === contact.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const referredBy = contact.referredById ? allContacts.find(c => c.id === contact.referredById) : null;
  const hasReferred = allContacts.filter(c => c.referredById === contact.id);
  const getScoreColor = (score: number) => {
    if (score > 75) return 'bg-green-500';
    if (score > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
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
          <TabsList className="grid w-full grid-cols-3 mt-4 px-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-momentum-light-slate">Relationship Intelligence</h3>
              {contact.relationshipStrength && (
                <div className="flex items-center text-sm">
                  <Zap className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                  <span className="text-momentum-dark-slate mr-2">Strength:</span>
                  <div className="flex items-center gap-2 w-1/2">
                    <Progress value={contact.relationshipStrength} className={cn("w-full h-2", getScoreColor(contact.relationshipStrength))} />
                    <span className="font-semibold text-momentum-slate">{contact.relationshipStrength}</span>
                  </div>
                </div>
              )}
            </div>
            <Separator />
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
          <TabsContent value="network" className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-momentum-light-slate">Referred By</h3>
              {referredBy ? (
                <div className="flex items-center gap-3 p-2 rounded-md bg-accent">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={referredBy.avatarUrl} alt={referredBy.name} />
                    <AvatarFallback>{referredBy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-momentum-slate">{referredBy.name}</p>
                    <p className="text-sm text-momentum-dark-slate">{referredBy.title}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-momentum-dark-slate">No referral information available.</p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-momentum-light-slate">Has Referred</h3>
              {hasReferred.length > 0 ? (
                <div className="space-y-2">
                  {hasReferred.map(c => (
                    <div key={c.id} className="flex items-center gap-3 p-2 rounded-md bg-accent">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={c.avatarUrl} alt={c.name} />
                        <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-momentum-slate">{c.name}</p>
                        <p className="text-sm text-momentum-dark-slate">{c.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-momentum-dark-slate">This contact has not referred anyone.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}