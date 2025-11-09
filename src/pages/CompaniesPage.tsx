import React, { useState } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Company } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CreateCompanyModal } from '@/components/companies/CreateCompanyModal';
import { EditCompanyModal } from '@/components/companies/EditCompanyModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCrmStore } from '@/stores/crm-store';
import { Toaster, toast } from 'sonner';
import { CompanyDetailSheet } from '@/components/companies/CompanyDetailSheet';
export function CompaniesPage() {
  const companies = useCrmStore(s => s.companies);
  const addCompany = useCrmStore(s => s.addCompany);
  const updateCompany = useCrmStore(s => s.updateCompany);
  const deleteCompany = useCrmStore(s => s.deleteCompany);
  const isLoading = useCrmStore(s => s.isLoading);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleCompanyCreated = async (newCompany: Company) => {
    const promise = addCompany(newCompany);
    toast.promise(promise, {
      loading: 'Creating company...',
      success: 'Company created successfully!',
      error: 'Failed to create company.',
    });
  };
  const handleUpdateCompany = async (updatedCompany: Company) => {
    const promise = updateCompany(updatedCompany);
    toast.promise(promise, {
      loading: 'Updating company...',
      success: 'Company updated successfully!',
      error: 'Failed to update company.',
    });
  };
  const handleDeleteCompany = (companyId: string) => {
    const promise = deleteCompany(companyId);
    toast.promise(promise, {
      loading: 'Deleting company...',
      success: 'Company deleted.',
      error: 'Failed to delete company.',
    });
  };
  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };
  const handleRowClick = (company: Company) => {
    setSelectedCompany(company);
    setIsSheetOpen(true);
  };
  const columns = [
    {
      accessor: 'name' as keyof Company,
      header: 'Company',
      cell: (item: Company) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.logoUrl} alt={item.name} />
            <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    { accessor: 'industry' as keyof Company, header: 'Industry' },
    {
      accessor: 'employees' as keyof Company,
      header: 'Employees',
      cell: (item: Company) => item.employees.toLocaleString(),
    },
    { accessor: 'location' as keyof Company, header: 'Location' },
    {
      accessor: 'actions' as const,
      header: 'Actions',
      cell: (item: Company) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteCompany(item.id); }} className="text-red-500">
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
      <Header>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Company
        </Button>
      </Header>
      <div className="p-4 md:p-8">
        <DataTable data={companies} columns={columns} isLoading={isLoading} onRowClick={handleRowClick} />
      </div>
      <CreateCompanyModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCompanyCreated={handleCompanyCreated}
      />
      <EditCompanyModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        company={selectedCompany}
        onCompanyUpdated={handleUpdateCompany}
      />
      <CompanyDetailSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        company={selectedCompany}
      />
    </>
  );
}