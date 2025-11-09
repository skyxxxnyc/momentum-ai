import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ICPS } from '@/lib/mock-data';
import { ICP } from '@/lib/types';
import { IcpCard } from '@/components/icp/IcpCard';
import { CreateEditIcpModal } from '@/components/icp/CreateEditIcpModal';
export function IcpPage() {
  const [icps, setIcps] = useState<ICP[]>(ICPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIcp, setSelectedIcp] = useState<ICP | null>(null);
  const handleCreateNew = () => {
    setSelectedIcp(null);
    setIsModalOpen(true);
  };
  const handleEdit = (icp: ICP) => {
    setSelectedIcp(icp);
    setIsModalOpen(true);
  };
  const handleDelete = (id: string) => {
    setIcps(prev => prev.filter(icp => icp.id !== id));
  };
  const handleSave = (icp: ICP) => {
    if (selectedIcp) {
      // Update
      setIcps(prev => prev.map(i => i.id === icp.id ? icp : i));
    } else {
      // Create
      setIcps(prev => [{ ...icp, id: `icp-${Date.now()}` }, ...prev]);
    }
    setIsModalOpen(false);
    setSelectedIcp(null);
  };
  return (
    <>
      <Header>
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Profile
        </Button>
      </Header>
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-momentum-slate">Ideal Customer Profiles</h1>
          <p className="text-momentum-dark-slate">Define and manage your target customer segments for AI-powered prospecting.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {icps.map(icp => (
            <IcpCard
              key={icp.id}
              icp={icp}
              onEdit={() => handleEdit(icp)}
              onDelete={() => handleDelete(icp.id)}
            />
          ))}
        </div>
        {icps.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-lg">
            <h3 className="text-xl font-semibold text-momentum-slate">No ICPs Found</h3>
            <p className="text-momentum-dark-slate mt-2 mb-4">Get started by creating your first Ideal Customer Profile.</p>
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Profile
            </Button>
          </div>
        )}
      </div>
      <CreateEditIcpModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        icp={selectedIcp}
        onSave={handleSave}
      />
    </>
  );
}