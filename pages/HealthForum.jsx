import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, MessageSquare, ThumbsUp, TrendingUp, Clock, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';

const categories = [
  { id: 'general', label: 'General' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'mental-health', label: 'Mental Health' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'chronic-conditions', label: 'Chronic Conditions' },
  { id: 'preventive-care', label: 'Preventive Care' }
];

export default function HealthForum() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // recent, popular, trending
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['forumPosts', selectedCategory, sortBy],
    queryFn: async () => {
      let filter = {};
      if (selectedCategory !== 'all') {
        filter.category = selectedCategory;
      }
      const sortField = sortBy === 'popular' ? '-upvotes' : sortBy === 'trending' ? '-views' : '-created_date';
      return base44.entities.ForumPost.filter(filter, sortField, 50);
    },
    enabled: !!user
  });

  const { data: myUpvotes = [] } = useQuery({
    queryKey: ['myUpvotes'],
    queryFn: () => base44.entities.PostUpvote.filter({ user_email: user?.email }, '-created_date', 100),
    enabled: !!user
  });

  const upvotePost = useMutation({
    mutationFn: async (postId) => {
      const alreadyUpvoted = myUpvotes.some(u => u.post_id === postId);
      if (alreadyUpvoted) {
        const upvote = myUpvotes.find(u => u.post_id === postId);
        await base44.entities.PostUpvote.delete(upvote.id);
        const post = posts.find(p => p.id === postId);
        await base44.entities.ForumPost.update(postId, { upvotes: (post.upvotes || 0) - 1 });
      } else {
        await base44.entities.PostUpvote.create({ post_id: postId, user_email: user.email });
        const post = posts.find(p => p.id === postId);
        await base44.entities.ForumPost.update(postId, { upvotes: (post.upvotes || 0) + 1 });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
      queryClient.invalidateQueries({ queryKey: ['myUpvotes'] });
    }
  });

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasUpvoted = (postId) => myUpvotes.some(u => u.post_id === postId);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 to-green-700 px-4 pt-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Community Forum</h1>
            <p className="text-green-100 text-sm">Share experiences, get support</p>
          </div>
          <Link to={createPageUrl('CreatePost')}>
            <Button className="bg-white text-green-600 hover:bg-green-50 rounded-xl flex items-center justify-center gap-2">
              <Plus size={18} />
              <span>New Post</span>
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="pl-10 rounded-xl bg-white border-0"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        {/* Sort Options */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'recent', label: 'Recent', icon: Clock },
            { key: 'popular', label: 'Popular', icon: ThumbsUp },
            { key: 'trending', label: 'Trending', icon: TrendingUp }
          ].map((sort) => {
            const Icon = sort.icon;
            return (
              <button
                key={sort.key}
                onClick={() => setSortBy(sort.key)}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  sortBy === sort.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={14} />
                {sort.label}
              </button>
            );
          })}
        </div>

        {/* Categories */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="px-4 py-4 space-y-3">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No posts yet</h3>
            <p className="text-sm text-gray-500 mb-4">Be the first to start a discussion!</p>
            <Link to={createPageUrl('CreatePost')}>
              <Button className="bg-green-600 hover:bg-green-700 rounded-xl">
                Create Post
              </Button>
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            {filteredPosts.map((post, index) => {
              const upvoted = hasUpvoted(post.id);
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <Link to={createPageUrl(`ForumPost?id=${post.id}`)}>
                    <div className="flex items-start gap-3">
                      {/* Author Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {post.author_name?.charAt(0) || 'A'}
                        </span>
                      </div>

                      {/* Post Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {post.is_pinned && (
                                <Pin size={14} className="text-green-600" />
                              )}
                              <h3 className="font-bold text-gray-900 line-clamp-2">
                                {post.title}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              by {post.author_name} • {format(new Date(post.created_date), 'MMM d')}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {post.content}
                        </p>

                        <div className="flex items-center gap-4">
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                            {post.category?.replace('-', ' ')}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MessageSquare size={14} />
                            <span>{post.reply_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span>{post.views || 0} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Upvote Button */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        upvotePost.mutate(post.id);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                        upvoted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <ThumbsUp size={14} className={upvoted ? 'fill-current' : ''} />
                      <span className="text-sm font-medium">{post.upvotes || 0}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}