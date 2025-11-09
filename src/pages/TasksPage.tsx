import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useCrmStore } from '@/stores/crm-store';
import { DataTable } from '@/components/shared/DataTable';
import { Task, TaskStatus } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Toaster, toast } from 'sonner';
import { CreateEditTaskModal } from '@/components/tasks/CreateEditTaskModal';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, isPast, isToday } from 'date-fns';
export function TasksPage() {
  const navigate = useNavigate();
  const tasks = useCrmStore(s => s.tasks);
  const users = useCrmStore(s => s.users);
  const deals = useCrmStore(s => s.deals);
  const contacts = useCrmStore(s => s.contacts);
  const addTask = useCrmStore(s => s.addTask);
  const updateTask = useCrmStore(s => s.updateTask);
  const deleteTask = useCrmStore(s => s.deleteTask);
  const isLoading = useCrmStore(s => s.isLoading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const handleSaveTask = async (task: Task) => {
    const promise = task.id ? updateTask(task) : addTask({ ...task, id: `task-${Date.now()}` });
    toast.promise(promise, {
      loading: 'Saving task...',
      success: 'Task saved successfully!',
      error: 'Failed to save task.',
    });
  };
  const handleDelete = (taskId: string) => {
    const promise = deleteTask(taskId);
    toast.promise(promise, {
      loading: 'Deleting task...',
      success: 'Task deleted.',
      error: 'Failed to delete task.',
    });
  };
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };
  const handleNewTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'To Do': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'In Progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Done': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  const columns = [
    { accessor: 'title' as keyof Task, header: 'Title' },
    {
      accessor: 'dueDate' as keyof Task,
      header: 'Due Date',
      cell: (item: Task) => {
        const date = new Date(item.dueDate);
        const isOverdue = isPast(date) && !isToday(date) && item.status !== 'Done';
        return (
          <span className={cn(isOverdue && 'text-red-400 font-semibold')}>
            {format(date, 'MMM d, yyyy')}
          </span>
        );
      },
    },
    {
      accessor: 'status' as keyof Task,
      header: 'Status',
      cell: (item: Task) => <Badge className={cn('hover:bg-inherit', getStatusColor(item.status))}>{item.status}</Badge>,
    },
    {
      accessor: 'ownerId' as keyof Task,
      header: 'Owner',
      cell: (item: Task) => users.find(u => u.id === item.ownerId)?.name || 'N/A',
    },
    {
      accessor: 'dealId' as keyof Task,
      header: 'Associated Deal',
      cell: (item: Task) => deals.find(d => d.id === item.dealId)?.title || 'N/A',
    },
    {
      accessor: 'actions' as const,
      header: 'Actions',
      cell: (item: Task) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(item)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
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
      <Header onNewTask={handleNewTask}>
        <Button onClick={handleNewTask}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </Header>
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-momentum-slate">Tasks</h1>
          <p className="text-momentum-dark-slate">Manage your to-do list and stay on top of your deals.</p>
        </div>
        <DataTable data={tasks} columns={columns} isLoading={isLoading} />
      </div>
      <CreateEditTaskModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={selectedTask}
        onSave={handleSaveTask}
      />
    </>
  );
}