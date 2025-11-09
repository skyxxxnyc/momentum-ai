import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { COMPANIES } from '@/lib/mock-data';
import { Company } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CreateCompanyModal } from '@/components/companies/CreateCompanyModal';
import { EditCompanyModal } from '@/components/companies/EditCompanyModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCompanies(COMPANIES);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const handleCompanyCreated = (newCompany: Company) => {
    setCompanies(prev => [newCompany, ...prev]);
  };
  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
  };
  const handleDeleteCompany = (companyId: string) => {
    setCompanies(prev => prev.filter(company => company.id !== companyId));
  };
  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
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
            <DropdownMenuItem onClick={() => handleEditClick(item)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteCompany(item.id)} className="text-red-500">
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
      <Header>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Company
        </Button>
      </Header>
      <div className="p-4 md:p-8">
        <DataTable data={companies} columns={columns} isLoading={isLoading} />
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
    </>
  );
}