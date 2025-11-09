import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCrmStore } from '@/stores/crm-store';
import { Contact } from '@/lib/types';
interface EditContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onContactUpdated: (contact: Contact) => void;
}
export function EditContactModal({ isOpen, onOpenChange, contact, onContactUpdated }: EditContactModalProps) {
  const companies = useCrmStore(s => s.companies);
  const allContacts = useCrmStore(s => s.contacts);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [referredById, setReferredById] = useState('');
  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setEmail(contact.email);
      setTitle(contact.title);
      setCompanyId(contact.companyId);
      setReferredById(contact.referredById || '');
    }
  }, [contact]);
  const handleSubmit = () => {
    if (!contact || !name || !email || !title || !companyId) return;
    const updatedContact: Contact = {
      ...contact,
      name,
      email,
      title,
      companyId,
      referredById: referredById || undefined,
    };
    onContactUpdated(updatedContact);
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/50 text-momentum-slate">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>Update the details for this contact.</DialogDescription>
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
                {allContacts.filter(c => c.id !== contact?.id).map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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