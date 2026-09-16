'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle, Send, Flag, Loader2 } from 'lucide-react';
import { getFilmComments, createComment, createReport } from '@/lib/supabase';
import { Comment } from '@/types';

interface CommentSectionProps {
  filmId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ filmId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadComments() {
      const data = await getFilmComments(filmId);
      setComments(data);
    }
    loadComments();
  }, [filmId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (text.length < 3) {
      setErrorMsg('Comment is too short.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const newComm = await createComment({ filmId, content: text });
      setComments([newComm, ...comments]);
      setText('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Please sign in to post a comment.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReportComment = async (commentId: string) => {
    try {
      await createReport({
        targetType: 'comment',
        targetId: commentId,
        reason: 'abusive',
        details: 'Reported by user from discussion comments'
      });
      alert('Comment reported to moderators.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Please sign in to report content.';
      alert(msg);
    }
  };

  return (
    <div className="bg-cinema-card rounded-3xl p-6 sm:p-8 border border-cinema-border mt-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-5 h-5 text-cinema-teal" />
        <h3 className="font-display font-bold text-lg text-white">Film Discussions & Comments</h3>
      </div>

      {/* Post Comment Input */}
      <form onSubmit={handlePostComment} className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
          placeholder="Add a comment to the discussion..."
          className="flex-1 bg-cinema-surface border border-cinema-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cinema-teal placeholder-gray-500"
          maxLength={300}
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="px-4 py-2.5 rounded-xl bg-cinema-teal hover:bg-cinema-teal/80 text-cinema-bg font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Post
        </button>
      </form>

      {errorMsg && <p className="text-xs text-cinema-accent mb-4">{errorMsg}</p>}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-cinema-surface/50 border border-cinema-border/40 flex items-start gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cinema-border flex-shrink-0 bg-cinema-card flex items-center justify-center font-bold text-white text-xs">
                {item.profile?.avatar_url ? (
                  <Image src={item.profile.avatar_url} alt={item.profile.full_name || 'User'} fill className="object-cover" sizes="32px" />
                ) : (
                  (item.profile?.full_name || 'User').charAt(0)
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{item.profile?.full_name || item.profile?.username || 'User'}</span>
                  <span className="text-[10px] text-cinema-muted">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-300 mt-1">{item.content}</p>
              </div>
              <button
                onClick={() => handleReportComment(item.id)}
                className="text-cinema-muted hover:text-cinema-accent p-1"
                title="Report Comment"
              >
                <Flag className="w-3 h-3" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-xs text-cinema-muted">
            No comments yet. Start the discussion!
          </div>
        )}
      </div>
    </div>
  );
};
