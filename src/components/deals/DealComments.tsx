import React, { useState } from 'react';
import { useCrmStore } from '@/stores/crm-store';
import { useUserStore } from '@/stores/user-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
interface DealCommentsProps {
  dealId: string;
}
export function DealComments({ dealId }: DealCommentsProps) {
  const comments = useCrmStore(s => s.comments);
  const addComment = useCrmStore(s => s.addComment);
  const user = useUserStore(s => s.user);
  const [newComment, setNewComment] = useState('');
  const dealComments = comments
    .filter(c => c.dealId === dealId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      dealId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatarUrl,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };
    const promise = addComment(comment);
    toast.promise(promise, {
      loading: 'Posting comment...',
      success: 'Comment posted!',
      error: 'Failed to post comment.',
    });
    setNewComment('');
  };
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-accent"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim()}>
              Comment
            </Button>
          </div>
        </div>
      </form>
      <div className="space-y-6">
        {dealComments.length > 0 ? (
          dealComments.map(comment => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-momentum-slate">{comment.userName}</p>
                  <p className="text-xs text-momentum-dark-slate">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-momentum-light-slate mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-momentum-dark-slate py-8">
            No comments yet. Be the first to collaborate!
          </p>
        )}
      </div>
    </div>
  );
}