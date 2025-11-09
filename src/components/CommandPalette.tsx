import React, { useEffect, useState } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { LayoutDashboard, Handshake, Users, MessageSquare, PlusCircle, Building, FileText, Contact, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEALS, CONTACTS, COMPANIES } from '@/lib/mock-data';
interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen, open]);
  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };
  const filteredDeals = search ? DEALS.filter(d => d.title.toLowerCase().includes(search.toLowerCase())).slice(0, 3) : [];
  const filteredContacts = search ? CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 3) : [];
  const filteredCompanies = search ? COMPANIES.filter(co => co.name.toLowerCase().includes(search.toLowerCase())).slice(0, 3) : [];
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Type a command or search..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {search && (filteredDeals.length > 0 || filteredContacts.length > 0 || filteredCompanies.length > 0) && (
          <CommandGroup heading="Search Results">
            {filteredDeals.map(deal => (
              <CommandItem key={deal.id} onSelect={() => runCommand(() => navigate('/deals'))}>
                <Briefcase className="mr-2 h-4 w-4" />
                <span>{deal.title}</span>
              </CommandItem>
            ))}
            {filteredContacts.map(contact => (
              <CommandItem key={contact.id} onSelect={() => runCommand(() => navigate('/contacts'))}>
                <Contact className="mr-2 h-4 w-4" />
                <span>{contact.name}</span>
              </CommandItem>
            ))}
            {filteredCompanies.map(company => (
              <CommandItem key={company.id} onSelect={() => runCommand(() => navigate('/companies'))}>
                <Building className="mr-2 h-4 w-4" />
                <span>{company.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/deals'))}>
            <Handshake className="mr-2 h-4 w-4" />
            <span>Deals</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/contacts'))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Contacts</span>
          </CommandItem>
           <CommandItem onSelect={() => runCommand(() => navigate('/companies'))}>
            <Building className="mr-2 h-4 w-4" />
            <span>Companies</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/chat'))}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>AI Agent</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => console.log('New Deal'))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Deal</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log('New Contact'))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Contact</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}