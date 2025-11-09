import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Deal, Contact, Company, Task } from '@/lib/types';
import { MessageSquarePlus, DollarSign, Calendar, User, Building, Mail, Phone, StickyNote, Briefcase, Edit, Trash2, Zap, PlusCircle, CheckSquare, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { AiActionModal } from '../shared/AiActionModal';
import { chatService } from '@/lib/chat';
import { useCrmStore } from '@/stores/crm-store';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { LogActivityForm } from '../shared/LogActivityForm';
import { DealComments } from './DealComments';
import { CreateEditTaskModal } from '../tasks/CreateEditTaskModal';
import { toast } from 'sonner';
import { format, isPast, isToday } from 'date-fns';
import { Badge } from '@/components/ui/badge';
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
  Note: StickyNote
};
const healthInfo = {
  on_track: { icon: ShieldCheck, color: 'text-green-400', label: 'On Track' },
  needs_attention: { icon: ShieldAlert, color: 'text-yellow-400', label: 'Needs Attention' },
  at_risk: { icon: ShieldX, color: 'text-red-400', label: 'At Risk' },
};
export function DealDetailSheet({ deal, contact, company, isOpen, onOpenChange, onEdit, onDelete }: DealDetailSheetProps) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const activities = useCrmStore((s) => s.activities);
  const tasks = useCrmStore((s) => s.tasks);
  const addTask = useCrmStore((s) => s.addTask);
  const handleDraftEmail = async () => {
    if (!deal || !contact || !company) return;
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiContent('');
    const prompt = `Draft a professional follow-up email to ${contact.name} (${contact.title} at ${company.name}) regarding the "${deal.title}" deal, which is currently in the '${deal.stage}' stage. The deal value is ${deal.value}. Keep it concise and aim to move the deal to the next stage.`;
    await chatService.sendMessage(prompt, undefined, (chunk) => {
      setAiContent((prev) => prev + chunk);
    });
    setIsAiLoading(false);
  };
  const handleSaveTask = (task: Task) => {
    const promise = addTask({ ...task, id: `task-${Date.now()}` });
    toast.promise(promise, {
      loading: 'Creating task...',
      success: 'Task created!',
      error: 'Failed to create task.'
    });
  };
  if (!deal) return null;
  const dealActivities = activities.filter((a) => a.dealId === deal.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const dealTasks = tasks.filter((t) => t.dealId === deal.id).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const getScoreColor = (score: number) => {
    if (score > 75) return 'bg-green-500';
    if (score > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const HealthIcon = deal.healthStatus ? healthInfo[deal.healthStatus].icon : null;
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-card border-l border-border/50 text-momentum-slate p-0 flex flex-col">
          <SheetHeader className="p-6 pb-0">
            <div className="flex justify-between items-start">
              <div>
                <SheetTitle className="text-2xl font-bold text-momentum-slate">{deal.title}</SheetTitle>
                <SheetDescription className="text-momentum-dark-slate">
                  {company?.name} · Stage: <span className="text-momentum-cyan">{deal.stage}</span>
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
            <TabsList className="grid w-full grid-cols-4 mt-4 px-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
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
                {deal.momentumScore &&
                <div className="flex items-center text-sm">
                    <Zap className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                    <span className="text-momentum-dark-slate mr-2">Momentum Score:</span>
                    <div className="flex items-center gap-2 w-1/2">
                      <Progress value={deal.momentumScore} className={cn("w-full h-2", getScoreColor(deal.momentumScore))} />
                      <span className="font-semibold text-momentum-slate">{deal.momentumScore}</span>
                    </div>
                  </div>
                }
                {HealthIcon && deal.healthStatus &&
                  <div className="flex items-center text-sm">
                    <HealthIcon className={cn("w-4 h-4 mr-3", healthInfo[deal.healthStatus].color)} />
                    <span className="text-momentum-dark-slate mr-2">Health Status:</span>
                    <span className={cn("font-semibold", healthInfo[deal.healthStatus].color)}>{healthInfo[deal.healthStatus].label}</span>
                  </div>
                }
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold text-momentum-light-slate">Associated People & Places</h3>
                {contact &&
                <div className="flex items-center text-sm">
                    <User className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={contact.avatarUrl} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{contact.name}</span>
                    <span className="text-momentum-dark-slate ml-2">({contact.title})</span>
                  </div>
                }
                {company &&
                <div className="flex items-center text-sm">
                    <Building className="w-4 h-4 mr-3 text-momentum-dark-slate" />
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={company.logoUrl} />
                      <AvatarFallback>{company.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{company.name}</span>
                  </div>
                }
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
              <LogActivityForm dealId={deal.id} contactId={deal.contactId} companyId={deal.companyId} />
              <Separator className="my-6" />
              <div className="space-y-6">
                {dealActivities.length > 0 ? dealActivities.map((activity) => {
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
                    </div>);
                }) :
                <p className="text-center text-sm text-momentum-dark-slate py-8">No activity recorded for this deal.</p>
                }
              </div>
            </TabsContent>
            <TabsContent value="tasks" className="flex-1 overflow-y-auto p-6 space-y-4">
              <Button onClick={() => setIsTaskModalOpen(true)} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
              <div className="space-y-4">
                {dealTasks.length > 0 ? dealTasks.map((task) => {
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
                    </div>);
                }) :
                <p className="text-center text-sm text-momentum-dark-slate py-8">No tasks for this deal.</p>
                }
              </div>
            </TabsContent>
            <TabsContent value="comments" className="flex-1 overflow-y-auto p-6">
              <DealComments dealId={deal.id} />
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
        onRegenerate={handleDraftEmail} />
      <CreateEditTaskModal
        isOpen={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        task={null}
        onSave={handleSaveTask}
        defaults={{ dealId: deal.id, contactId: deal.contactId, companyId: deal.companyId }} />
    </>);
}