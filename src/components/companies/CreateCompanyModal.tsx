import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Company } from '@/lib/types';
interface CreateCompanyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyCreated: (company: Company) => void;
}
export function CreateCompanyModal({ isOpen, onOpenChange, onCompanyCreated }: CreateCompanyModalProps) {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const handleSubmit = () => {
    if (!name || !industry || !location) return;
    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      name,
      industry,
      location,
      employees: 1, // Default value
      logoUrl: `https://logo.clearbit.com/${name.toLowerCase().replace(/ /g, '')}.com`,
    };
    onCompanyCreated(newCompany);
    onOpenChange(false);
    // Reset form
    setName('');
    setIndustry('');
    setLocation('');
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/50 text-momentum-slate">
        <DialogHeader>
          <DialogTitle>Create New Company</DialogTitle>
          <DialogDescription>Enter the details for the new company.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-accent" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="industry" className="text-right">Industry</Label>
            <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="col-span-3 bg-accent" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3 bg-accent" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Create Company</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}