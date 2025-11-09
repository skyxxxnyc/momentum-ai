import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { DataTable } from '@/components/shared/DataTable';
import { Lead } from '@/lib/types';
import { useCrmStore } from '@/stores/crm-store';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Zap } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Toaster, toast } from 'sonner';
export function LeadsPage() {
  const leads = useCrmStore(s => s.leads);
  const convertLead = useCrmStore(s => s.convertLead);
  const deleteLead = useCrmStore(s => s.deleteLead);
  const [isLoading, setIsLoading] = useState(false); // Can be used for async actions
  const handleConvert = (leadId: string) => {
    convertLead(leadId);
    toast.success('Lead converted successfully!', {
      description: 'A new contact, company, and deal have been created.',
    });
  };
  const handleDelete = (leadId: string) => {
    deleteLead(leadId);
    toast.error('Lead deleted.');
  };
  const columns = [
    { accessor: 'name' as keyof Lead, header: 'Name' },
    { accessor: 'title' as keyof Lead, header: 'Title' },
    { accessor: 'companyName' as keyof Lead, header: 'Company' },
    { accessor: 'email' as keyof Lead, header: 'Email' },
    { accessor: 'location' as keyof Lead, header: 'Location' },
    { accessor: 'status' as keyof Lead, header: 'Status' },
    {
      accessor: 'actions' as const,
      header: 'Actions',
      cell: (item: Lead) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleConvert(item.id)}>
              <Zap className="mr-2 h-4 w-4" />
              <span>Convert Lead</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return (
    <>
      <Toaster richColors theme="dark" />
      <Header />
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-momentum-slate">AI-Generated Leads</h1>
          <p className="text-momentum-dark-slate">Prospects generated from your Ideal Customer Profiles.</p>
        </div>
        <DataTable data={leads} columns={columns} isLoading={isLoading} />
      </div>
    </>
  );
}