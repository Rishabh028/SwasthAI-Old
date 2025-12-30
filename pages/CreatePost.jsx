import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const categories = [
  { id: 'general', label: 'General Discussion' },
  { id: 'nutrition', label: 'Nutrition & Diet' },
  { id: 'fitness', label: 'Fitness & Exercise' },
  { id: 'mental-health', label: 'Mental Health' },
  { id: 'wellness', label: 'Wellness & Lifestyle' },
  { id: 'chronic-conditions', label: 'Chronic Conditions' },
  { id: 'preventive-care', label: 'Preventive Care' }
];

export default function CreatePost() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const createPost = useMutation({
    mutationFn: () => base44.entities.ForumPost.create({
      title,
      content,
      category,
      author_name: user?.full_name || 'Anonymous',
      upvotes: 0,
      views: 0,
      reply_count: 0
    }),
    onSuccess: () => {
      navigate(createPageUrl('HealthForum'));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      createPost.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('HealthForum')}>
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Create Post</h1>
            <p className="text-xs text-gray-500">Share with the community</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`p-3 rounded-xl text-sm font-medium text-left transition-all ${
                  category === cat.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your question or topic?"
            className="rounded-xl"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Details</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Provide more details about your question or share your experience..."
            className="rounded-xl min-h-[200px]"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            Be respectful and constructive. Share helpful information.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!title.trim() || !content.trim() || createPost.isPending}
          className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700"
        >
          {createPost.isPending ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Posting...
            </>
          ) : (
            'Publish Post'
          )}
        </Button>
      </form>
    </div>
  );
}