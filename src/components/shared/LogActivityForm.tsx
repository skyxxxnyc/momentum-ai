import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCrmStore } from '@/stores/crm-store';
import { Activity } from '@/lib/types';
import { toast } from 'sonner';
interface LogActivityFormProps {
  dealId?: string;
  contactId?: string;
  companyId: string;
}
export function LogActivityForm({ dealId, contactId, companyId }: LogActivityFormProps) {
  const [activityType, setActivityType] = useState<'Note' | 'Call' | 'Email' | 'Meeting'>('Note');
  const [subject, setSubject] = useState('');
  const addActivity = useCrmStore(s => s.addActivity);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !contactId) {
      toast.error('Please provide details for the activity.');
      return;
    }
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type: activityType,
      subject: subject.trim(),
      date: new Date().toISOString(),
      contactId,
      dealId,
      companyId,
      userId: 'user-1', // Placeholder for authenticated user
    };
    const promise = addActivity(newActivity);
    toast.promise(promise, {
      loading: 'Logging activity...',
      success: 'Activity logged successfully!',
      error: 'Failed to log activity.',
    });
    setSubject('');
    setActivityType('Note');
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Select value={activityType} onValueChange={(value) => setActivityType(value as any)}>
          <SelectTrigger className="w-[120px] bg-accent">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Note">Note</SelectItem>
            <SelectItem value="Call">Call</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Meeting">Meeting</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder={`Add a ${activityType.toLowerCase()}...`}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-1 bg-accent"
          rows={2}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={!subject.trim()}>Log Activity</Button>
      </div>
    </form>
  );
}