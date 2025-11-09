import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONTACTS, COMPANIES, STAGES } from '@/lib/mock-data';
import { Deal, Stage } from '@/lib/types';
interface EditDealModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
  onDealUpdated: (deal: Deal) => void;
}
export function EditDealModal({ isOpen, onOpenChange, deal, onDealUpdated }: EditDealModalProps) {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState<Stage>('Lead');
  const [companyId, setCompanyId] = useState('');
  const [contactId, setContactId] = useState('');
  useEffect(() => {
    if (deal) {
      setTitle(deal.title);
      setValue(String(deal.value));
      setStage(deal.stage);
      setCompanyId(deal.companyId);
      setContactId(deal.contactId);
    }
  }, [deal]);
  const handleSubmit = () => {
    if (!deal || !title || !value || !stage || !companyId || !contactId) return;
    const updatedDeal: Deal = {
      ...deal,
      title,
      value: parseInt(value, 10),
      stage,
      companyId,
      contactId,
    };
    onDealUpdated(updatedDeal);
    onOpenChange(false);
  };
  const filteredContacts = companyId ? CONTACTS.filter(c => c.companyId === companyId) : CONTACTS;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/50 text-momentum-slate">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
          <DialogDescription>Update the details for this deal.</DialogDescription>
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
            <Label htmlFor="stage" className="text-right">Stage</Label>
            <Select value={stage} onValueChange={(val) => setStage(val as Stage)}>
              <SelectTrigger className="col-span-3 bg-accent">
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}