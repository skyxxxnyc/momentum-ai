import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ICP } from '@/lib/types';
import { X } from 'lucide-react';
interface CreateEditIcpModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  icp: ICP | null;
  onSave: (icp: ICP) => void;
}
export function CreateEditIcpModal({ isOpen, onOpenChange, icp, onSave }: CreateEditIcpModalProps) {
  const [name, setName] = useState('');
  const [industries, setIndustries] = useState<string[]>([]);
  const [industryInput, setIndustryInput] = useState('');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [location, setLocation] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  useEffect(() => {
    if (icp) {
      setName(icp.name);
      setIndustries(icp.industries);
      setMinSize(String(icp.companySize[0]));
      setMaxSize(String(icp.companySize[1]));
      setLocation(icp.location);
      setKeywords(icp.keywords);
    } else {
      // Reset form for 'create'
      setName('');
      setIndustries([]);
      setMinSize('');
      setMaxSize('');
      setLocation('');
      setKeywords([]);
    }
  }, [icp, isOpen]);
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>, setTags: React.Dispatch<React.SetStateAction<string[]>>, tagInput: string, setTagInput: React.Dispatch<React.SetStateAction<string>>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!setTags.toString().includes(tagInput.trim())) {
        setTags(prev => [...prev, tagInput.trim()]);
      }
      setTagInput('');
    }
  };
  const removeTag = (tagToRemove: string, setTags: React.Dispatch<React.SetStateAction<string[]>>) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };
  const handleSubmit = () => {
    const newIcp: Omit<ICP, 'id'> = {
      name,
      industries,
      companySize: [parseInt(minSize) || 0, parseInt(maxSize) || 0],
      location,
      keywords,
    };
    onSave({ ...icp, ...newIcp, id: icp?.id || '' });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card border-border/50 text-momentum-slate">
        <DialogHeader>
          <DialogTitle>{icp ? 'Edit' : 'Create'} Ideal Customer Profile</DialogTitle>
          <DialogDescription>Define the attributes of your target customers.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Profile Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-accent" placeholder="e.g., High-Growth Tech Startups" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industries">Target Industries</Label>
            <div className="flex flex-wrap gap-2 p-2 rounded-md border border-input bg-accent">
              {industries.map(ind => (
                <span key={ind} className="flex items-center gap-1 bg-background text-sm px-2 py-0.5 rounded">
                  {ind}
                  <button onClick={() => removeTag(ind, setIndustries)}><X className="h-3 w-3" /></button>
                </span>
              ))}
              <Input id="industries" value={industryInput} onChange={(e) => setIndustryInput(e.target.value)} onKeyDown={(e) => handleTagInput(e, setIndustries, industryInput, setIndustryInput)} className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0" placeholder="Add industry and press Enter" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSize">Company Size (Min)</Label>
              <Input id="minSize" type="number" value={minSize} onChange={(e) => setMinSize(e.target.value)} className="bg-accent" placeholder="e.g., 50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSize">Company Size (Max)</Label>
              <Input id="maxSize" type="number" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} className="bg-accent" placeholder="e.g., 500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-accent" placeholder="e.g., North America" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <div className="flex flex-wrap gap-2 p-2 rounded-md border border-input bg-accent">
              {keywords.map(kw => (
                <span key={kw} className="flex items-center gap-1 bg-background text-sm px-2 py-0.5 rounded">
                  {kw}
                  <button onClick={() => removeTag(kw, setKeywords)}><X className="h-3 w-3" /></button>
                </span>
              ))}
              <Input id="keywords" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={(e) => handleTagInput(e, setKeywords, keywordInput, setKeywordInput)} className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0" placeholder="Add keyword and press Enter" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}