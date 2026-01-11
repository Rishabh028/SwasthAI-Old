import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ThumbsUp, MessageCircle, Share2, Flag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { format } from 'date-fns';

export default function ForumPost() {
  const [user, setUser] = useState(null);
  const [reply, setReply] = useState('');
  const queryClient = useQueryClient();
  const postId = new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: post } = useQuery({
    queryKey: ['forumPost', postId],
    queryFn: async () => {
      const posts = await base44.entities.ForumPost.filter({ id: postId }, '-created_date', 1);
      if (posts[0]) {
        // Increment view count
        await base44.entities.ForumPost.update(postId, { views: (posts[0].views || 0) + 1 });
      }
      return posts[0];
    },
    enabled: !!postId && !!user
  });

  const { data: replies = [] } = useQuery({
    queryKey: ['forumReplies', postId],
    queryFn: () => base44.entities.ForumReply.filter({ post_id: postId }, '-created_date', 100),
    enabled: !!postId && !!user
  });

  const { data: myUpvotes = [] } = useQuery({
    queryKey: ['myUpvotes'],
    queryFn: () => base44.entities.PostUpvote.filter({ user_email: user?.email }, '-created_date', 100),
    enabled: !!user
  });

  const postReply = useMutation({
    mutationFn: () => base44.entities.ForumReply.create({
      post_id: postId,
      content: reply,
      author_name: user?.full_name || 'Anonymous'
    }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['forumReplies', postId] });
      await base44.entities.ForumPost.update(postId, { reply_count: (post?.reply_count || 0) + 1 });
      queryClient.invalidateQueries({ queryKey: ['forumPost', postId] });
      setReply('');
    }
  });

  const upvotePost = useMutation({
    mutationFn: async () => {
      const alreadyUpvoted = myUpvotes.some(u => u.post_id === postId);
      if (alreadyUpvoted) {
        const upvote = myUpvotes.find(u => u.post_id === postId);
        await base44.entities.PostUpvote.delete(upvote.id);
        await base44.entities.ForumPost.update(postId, { upvotes: (post?.upvotes || 0) - 1 });
      } else {
        await base44.entities.PostUpvote.create({ post_id: postId, user_email: user.email });
        await base44.entities.ForumPost.update(postId, { upvotes: (post?.upvotes || 0) + 1 });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumPost', postId] });
      queryClient.invalidateQueries({ queryKey: ['myUpvotes'] });
    }
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const hasUpvoted = myUpvotes.some(u => u.post_id === postId);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <Link to={createPageUrl('HealthForum')}>
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Share2 size={20} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Flag size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-6">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mb-4 capitalize">
          {post.category?.replace('-', ' ')}
        </span>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
            <span className="text-white font-medium">
              {post.author_name?.charAt(0) || 'A'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{post.author_name}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(post.created_date), 'MMM d, yyyy')} • {post.views || 0} views
            </p>
          </div>
        </div>

        {/* Post Body */}
        <div className="prose prose-sm max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Upvote Button */}
        <button
          onClick={() => upvotePost.mutate()}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            hasUpvoted
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ThumbsUp size={18} className={hasUpvoted ? 'fill-current' : ''} />
          <span className="font-medium">{post.upvotes || 0} helpful</span>
        </button>

        {/* Replies Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={20} className="text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Replies ({replies.length})</h2>
          </div>

          {/* Reply Form */}
          {user && !post.is_locked && (
            <div className="mb-6">
              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Share your thoughts or advice..."
                className="rounded-xl mb-3"
                rows={3}
              />
              <Button
                onClick={() => postReply.mutate()}
                disabled={!reply.trim() || postReply.isPending}
                className="rounded-xl bg-green-600 hover:bg-green-700"
              >
                {postReply.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Posting...
                  </>
                ) : (
                  'Post Reply'
                )}
              </Button>
            </div>
          )}

          {post.is_locked && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800">
                This discussion has been locked by moderators.
              </p>
            </div>
          )}

          {/* Replies List */}
          <div className="space-y-4">
            {replies.map((r, index) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl p-4 border ${
                  r.is_helpful ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">
                      {r.author_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 text-sm">{r.author_name}</p>
                      {r.is_helpful && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Helpful
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-2 whitespace-pre-wrap">{r.content}</p>
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600">
                      <ThumbsUp size={12} />
                      <span>{r.upvotes || 0}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}