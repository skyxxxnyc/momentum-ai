import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Company, Task } from '@/lib/types';
import { Mail, Phone, StickyNote, Briefcase, Building, Users, MapPin, BarChart, Zap, PlusCircle, CheckSquare } from 'lucide-react';
import { useCrmStore } from '@/stores/crm-store';
import { LogActivityForm } from '../shared/LogActivityForm';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CreateEditTaskModal } from '../tasks/CreateEditTaskModal';
import { toast } from 'sonner';
import { format, isPast, isToday } from 'date-fns';
import { Badge } from '@/components/ui/badge';
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
  const tasks = useCrmStore(s => s.tasks);
  const addTask = useCrmStore(s => s.addTask);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const handleSaveTask = (task: Task) => {
    const promise = addTask({ ...task, id: `task-${Date.now()}` });
    toast.promise(promise, {
      loading: 'Creating task...',
      success: 'Task created!',
      error: 'Failed to create task.',
    });
  };
  if (!company) return null;
  const companyActivities = activities.filter(a => a.companyId === company.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const companyContacts = contacts.filter(c => c.companyId === company.id);
  const companyTasks = tasks.filter(t => t.companyId === company.id).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const getScoreColor = (score: number) => {
    if (score > 75) return 'bg-green-500';
    if (score > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  return (
    <>
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
            <TabsList className="grid w-full grid-cols-4 mt-4 px-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="contacts">Contacts ({companyContacts.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-momentum-light-slate">Relationship Intelligence</h3>
                {company.relationshipStrength && (
                  <div className="flex items-center text-sm">
                    <Zap className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                    <span className="text-momentum-dark-slate mr-2">Strength:</span>
                    <div className="flex items-center gap-2 w-1/2">
                      <Progress value={company.relationshipStrength} className={cn("w-full h-2", getScoreColor(company.relationshipStrength))} />
                      <span className="font-semibold text-momentum-slate">{company.relationshipStrength}</span>
                    </div>
                  </div>
                )}
              </div>
              <Separator />
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
              <LogActivityForm companyId={company.id} contactId={companyContacts[0]?.id} />
              <Separator className="my-6" />
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
            <TabsContent value="tasks" className="flex-1 overflow-y-auto p-6 space-y-4">
              <Button onClick={() => setIsTaskModalOpen(true)} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
              <div className="space-y-4">
                {companyTasks.length > 0 ? companyTasks.map((task) => {
                  const date = new Date(task.dueDate);
                  const isOverdue = isPast(date) && !isToday(date) && task.status !== 'Done';
                  return (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-md bg-accent">
                      <CheckSquare className="h-5 w-5 mt-1 text-momentum-dark-slate" />
                      <div className="flex-1">
                        <p className="text-momentum-light-slate">{task.title}</p>
                        <p className={cn("text-xs", isOverdue ? "text-red-400" : "text-momentum-dark-slate")}>
                          Due: {format(date, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant={task.status === 'Done' ? 'default' : 'secondary'}>{task.status}</Badge>
                    </div>
                  );
                }) : (
                  <p className="text-center text-sm text-momentum-dark-slate py-8">No tasks for this company.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
      <CreateEditTaskModal
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        task={null}
        onSave={handleSaveTask}
        defaults={{ companyId: company.id, contactId: companyContacts[0]?.id }}
      />
    </>
  );
}