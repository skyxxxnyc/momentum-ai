import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useCrmStore } from '@/stores/crm-store';
import { DataTable } from '@/components/shared/DataTable';
import { Article } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Toaster, toast } from 'sonner';
export function ArticleListPage() {
  const navigate = useNavigate();
  const articles = useCrmStore(s => s.articles);
  const deleteArticle = useCrmStore(s => s.deleteArticle);
  const isLoading = useCrmStore(s => s.isLoading);
  const handleDelete = (articleId: string) => {
    const promise = deleteArticle(articleId);
    toast.promise(promise, {
      loading: 'Deleting article...',
      success: 'Article deleted.',
      error: 'Failed to delete article.',
    });
  };
  const columns = [
    { accessor: 'title' as keyof Article, header: 'Title' },
    { accessor: 'category' as keyof Article, header: 'Category' },
    {
      accessor: 'actions' as const,
      header: 'Actions',
      cell: (item: Article) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/admin/articles/edit/${item.id}`)}>
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
      <Header>
        <Button onClick={() => navigate('/admin/articles/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </Header>
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-momentum-slate">Manage Knowledge Hub</h1>
          <p className="text-momentum-dark-slate">Create, edit, and delete articles.</p>
        </div>
        <DataTable data={articles} columns={columns} isLoading={isLoading} />
      </div>
    </>
  );
}