import React from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { COMPANIES } from '@/lib/mock-data';
import { Company } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
export function CompaniesPage() {
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
  ];
  return (
    <div className="p-4 md:p-8">
      <DataTable data={COMPANIES} columns={columns} />
    </div>
  );
}