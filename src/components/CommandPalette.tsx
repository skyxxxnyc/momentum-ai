import React, { useEffect, useState } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { LayoutDashboard, Handshake, Users, MessageSquare, PlusCircle, Building, Contact, Briefcase, BookOpen, Target, ListFilter, LayoutGrid, FileText, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCrmStore } from '@/stores/crm-store';
interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onNewDeal?: () => void;
  onNewContact?: () => void;
  onNewTask?: () => void;
}
export function CommandPalette({ open, setOpen, onNewDeal, onNewContact, onNewTask }: CommandPaletteProps) {
  const navigate = useNavigate();
  const deals = useCrmStore(s => s.deals);
  const contacts = useCrmStore(s => s.contacts);
  const companies = useCrmStore(s => s.companies);
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
  const filteredDeals = search ? deals.filter(d => d.title.toLowerCase().includes(search.toLowerCase())).slice(0, 3) : [];
  const filteredContacts = search ? contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 3) : [];
  const filteredCompanies = search ? companies.filter(co => co.name.toLowerCase().includes(search.toLowerCase())).slice(0, 3) : [];
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
          <CommandItem onSelect={() => runCommand(() => navigate('/my-hub'))}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>My Hub</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/deals'))}>
            <Handshake className="mr-2 h-4 w-4" />
            <span>Deals</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/leads'))}>
            <ListFilter className="mr-2 h-4 w-4" />
            <span>Leads</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/contacts'))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Contacts</span>
          </CommandItem>
           <CommandItem onSelect={() => runCommand(() => navigate('/companies'))}>
            <Building className="mr-2 h-4 w-4" />
            <span>Companies</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/tasks'))}>
            <CheckSquare className="mr-2 h-4 w-4" />
            <span>Tasks</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/icps'))}>
            <Target className="mr-2 h-4 w-4" />
            <span>ICPs</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/sales-collateral'))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Sales Collateral</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/knowledge-hub'))}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Knowledge Hub</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/chat'))}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>AI Agent</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => onNewDeal?.())} disabled={!onNewDeal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Deal</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNewContact?.())} disabled={!onNewContact}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Contact</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNewTask?.())} disabled={!onNewTask}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Task</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}