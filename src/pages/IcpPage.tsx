import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { ICP, Lead } from '@/lib/types';
import { IcpCard } from '@/components/icp/IcpCard';
import { CreateEditIcpModal } from '@/components/icp/CreateEditIcpModal';
import { useCrmStore } from '@/stores/crm-store';
import { chatService } from '@/lib/chat';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
export function IcpPage() {
  const navigate = useNavigate();
  const icps = useCrmStore(s => s.icps);
  const addIcp = useCrmStore(s => s.addIcp);
  const updateIcp = useCrmStore(s => s.updateIcp);
  const deleteIcp = useCrmStore(s => s.deleteIcp);
  const addLeads = useCrmStore(s => s.addLeads);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIcp, setSelectedIcp] = useState<ICP | null>(null);
  const [isFindingLeads, setIsFindingLeads] = useState<string | null>(null);
  const handleCreateNew = () => {
    setSelectedIcp(null);
    setIsModalOpen(true);
  };
  const handleEdit = (icp: ICP) => {
    setSelectedIcp(icp);
    setIsModalOpen(true);
  };
  const handleDelete = (id: string) => {
    const promise = deleteIcp(id);
    toast.promise(promise, {
      loading: 'Deleting ICP...',
      success: 'ICP deleted.',
      error: 'Failed to delete ICP.',
    });
  };
  const handleSave = async (icp: ICP) => {
    const promise = selectedIcp ? updateIcp(icp) : addIcp({ ...icp, id: `icp-${Date.now()}` });
    toast.promise(promise, {
      loading: 'Saving ICP...',
      success: 'ICP saved successfully!',
      error: 'Failed to save ICP.',
    });
    setIsModalOpen(false);
    setSelectedIcp(null);
  };
  const handleFindLeads = async (icp: ICP) => {
    setIsFindingLeads(icp.id);
    toast.info(`Finding leads for "${icp.name}"...`);
    const prompt = `
      Based on the following Ideal Customer Profile, generate a list of 5 fictional leads.
      ICP Name: ${icp.name}
      Target Industries: ${icp.industries.join(', ')}
      Company Size: ${icp.companySize[0]}-${icp.companySize[1]} employees
      Location: ${icp.location}
      Keywords: ${icp.keywords.join(', ')}
      Please provide the response as a JSON array of objects, where each object has the following keys: "name", "title", "companyName", "email", "location", and "leadScore" (a number between 50 and 100). Do not include any other text or explanation in your response, only the JSON array.
    `;
    let aiResponse = '';
    await chatService.sendMessage(prompt, undefined, (chunk) => {
      aiResponse += chunk;
    });
    try {
      const parsedLeads = JSON.parse(aiResponse);
      if (Array.isArray(parsedLeads)) {
        const newLeads: Lead[] = parsedLeads.map((l: any) => ({
          id: `lead-${Date.now()}-${Math.random()}`,
          name: l.name || 'N/A',
          title: l.title || 'N/A',
          companyName: l.companyName || 'N/A',
          email: l.email || 'N/A',
          location: l.location || 'N/A',
          status: 'New',
          leadScore: l.leadScore || 75,
        }));
        addLeads(newLeads);
        toast.success(`${newLeads.length} new leads generated!`);
        navigate('/leads');
      } else {
        throw new Error("AI response was not an array.");
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error, "Response:", aiResponse);
      toast.error("Failed to generate leads. The AI returned an invalid format.");
    }
    setIsFindingLeads(null);
  };
  return (
    <>
      <Toaster richColors theme="dark" />
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
              onFindLeads={() => handleFindLeads(icp)}
              isFindingLeads={isFindingLeads === icp.id}
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