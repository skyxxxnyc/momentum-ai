import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCrmStore } from '@/stores/crm-store';
import { Contact } from '@/lib/types';
interface CreateContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContactCreated: (contact: Contact) => void;
}
export function CreateContactModal({ isOpen, onOpenChange, onContactCreated }: CreateContactModalProps) {
  const companies = useCrmStore(s => s.companies);
  const contacts = useCrmStore(s => s.contacts);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [referredById, setReferredById] = useState('');
  const handleSubmit = () => {
    if (!name || !email || !title || !companyId) return;
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name,
      email,
      title,
      companyId,
      lastContacted: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/8.x/avataaars/svg?seed=${name}`,
      referredById: referredById || undefined,
    };
    onContactCreated(newContact);
    onOpenChange(false);
    // Reset form
    setName('');
    setEmail('');
    setTitle('');
    setCompanyId('');
    setReferredById('');
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/50 text-momentum-slate">
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
          <DialogDescription>Enter the details for the new contact.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-accent" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3 bg-accent" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3 bg-accent" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">Company</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger className="col-span-3 bg-accent">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="referredBy" className="text-right">Referred By</Label>
            <Select value={referredById} onValueChange={setReferredById}>
              <SelectTrigger className="col-span-3 bg-accent">
                <SelectValue placeholder="Select referrer (optional)" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Create Contact</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}