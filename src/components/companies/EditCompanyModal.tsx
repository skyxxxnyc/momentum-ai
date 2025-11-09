import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Company } from '@/lib/types';
interface EditCompanyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
  onCompanyUpdated: (company: Company) => void;
}
export function EditCompanyModal({ isOpen, onOpenChange, company, onCompanyUpdated }: EditCompanyModalProps) {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [employees, setEmployees] = useState('');
  const [website, setWebsite] = useState('');
  useEffect(() => {
    if (company) {
      setName(company.name);
      setIndustry(company.industry);
      setLocation(company.location);
      setEmployees(String(company.employees));
      setWebsite(company.website);
    }
  }, [company]);
  const handleSubmit = () => {
    if (!company || !name || !industry || !location || !employees || !website) return;
    const updatedCompany: Company = {
      ...company,
      name,
      industry,
      location,
      employees: parseInt(employees, 10),
      website,
    };
    onCompanyUpdated(updatedCompany);
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/50 text-momentum-slate">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>Update the details for this company.</DialogDescription>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employees" className="text-right">Employees</Label>
            <Input id="employees" type="number" value={employees} onChange={(e) => setEmployees(e.target.value)} className="col-span-3 bg-accent" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">Website</Label>
            <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="col-span-3 bg-accent" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}