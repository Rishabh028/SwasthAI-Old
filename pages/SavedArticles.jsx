import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BookmarkCheck, Trash2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function SavedArticles() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: savedArticles = [], isLoading } = useQuery({
    queryKey: ['savedArticles'],
    queryFn: () => base44.entities.SavedArticle.list('-saved_date', 100),
    enabled: !!user
  });

  const deleteArticle = useMutation({
    mutationFn: (articleId) => base44.entities.SavedArticle.delete(articleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedArticles'] })
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('HealthArticles')}>
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Saved Articles</h1>
            <p className="text-xs text-gray-500">Your bookmarked health articles</p>
          </div>
        </div>
      </div>

      {/* Saved Articles List */}
      <div className="px-4 py-4 space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : savedArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookmarkCheck size={32} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No saved articles</h3>
            <p className="text-sm text-gray-500 mb-4">Start bookmarking articles to read later</p>
            <Link to={createPageUrl('HealthArticles')}>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                Browse Articles
              </button>
            </Link>
          </div>
        ) : (
          savedArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Article Image */}
              {article.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-gray-900 flex-1">
                    {article.title}
                  </h3>
                  <button
                    onClick={() => deleteArticle.mutate(article.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>

                {article.category && (
                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-2 capitalize">
                    {article.category.replace('-', ' ')}
                  </span>
                )}

                {article.content && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {article.content}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Saved {article.saved_date ? format(new Date(article.saved_date), 'MMM d, yyyy') : ''}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 text-blue-600 hover:text-blue-700"
                  >
                    Read More →
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}