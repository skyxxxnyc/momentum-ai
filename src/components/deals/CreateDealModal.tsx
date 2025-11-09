import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONTACTS, COMPANIES, STAGES } from '@/lib/mock-data';
import { Deal } from '@/lib/types';
interface CreateDealModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDealCreated: (deal: Deal) => void;
}
export function CreateDealModal({ isOpen, onOpenChange, onDealCreated }: CreateDealModalProps) {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [contactId, setContactId] = useState('');
  const handleSubmit = () => {
    if (!title || !value || !companyId || !contactId) return;
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title,
      value: parseInt(value, 10),
      stage: 'Lead',
      companyId,
      contactId,
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    };
    onDealCreated(newDeal);
    onOpenChange(false);
    // Reset form
    setTitle('');
    setValue('');
    setCompanyId('');
    setContactId('');
  };
  const filteredContacts = companyId ? CONTACTS.filter(c => c.companyId === companyId) : CONTACTS;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/50 text-momentum-slate">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
          <DialogDescription>Enter the details for the new deal.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3 bg-accent" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">Value ($)</Label>
            <Input id="value" type="number" value={value} onChange={(e) => setValue(e.target.value)} className="col-span-3 bg-accent" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">Company</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger className="col-span-3 bg-accent">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {COMPANIES.map(company => (
                  <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">Contact</Label>
            <Select value={contactId} onValueChange={setContactId} disabled={!companyId}>
              <SelectTrigger className="col-span-3 bg-accent">
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                {filteredContacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Create Deal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}