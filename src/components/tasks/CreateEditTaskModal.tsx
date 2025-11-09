import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { useCrmStore } from '@/stores/crm-store';
import { useUserStore } from '@/stores/user-store';
import { Task, TaskStatus } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
interface CreateEditTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (task: Task) => void;
  defaults?: { dealId?: string; contactId?: string; companyId?: string };
}
const TASK_STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
export function CreateEditTaskModal({ isOpen, onOpenChange, task, onSave, defaults = {} }: CreateEditTaskModalProps) {
  const deals = useCrmStore(s => s.deals);
  const user = useUserStore(s => s.user);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [dealId, setDealId] = useState<string | undefined>('');
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDueDate(new Date(task.dueDate));
        setStatus(task.status);
        setDealId(task.dealId);
      } else {
        setTitle('');
        setDueDate(new Date());
        setStatus('To Do');
        setDealId(defaults.dealId);
      }
    }
  }, [task, isOpen, defaults]);
  const handleSubmit = () => {
    if (!title || !dueDate || !user) return;
    const associatedDeal = deals.find(d => d.id === dealId);
    const savedTask: Omit<Task, 'id'> = {
      title,
      dueDate: dueDate.toISOString(),
      status,
      ownerId: user.id,
      dealId: dealId || undefined,
      contactId: associatedDeal?.contactId || defaults.contactId,
      companyId: associatedDeal?.companyId || defaults.companyId,
    };
    onSave({ ...task, ...savedTask, id: task?.id || '' });
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/50 text-momentum-slate">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>Fill in the details for your task.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-accent" />
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-accent",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger className="bg-accent">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dealId">Associated Deal (Optional)</Label>
            <Select value={dealId} onValueChange={setDealId}>
              <SelectTrigger className="bg-accent">
                <SelectValue placeholder="Select a deal" />
              </SelectTrigger>
              <SelectContent>
                {deals.map(d => <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}