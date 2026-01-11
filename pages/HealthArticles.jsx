import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, Bookmark, BookmarkCheck, Clock, TrendingUp, Heart, Brain, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Skeleton } from '@/Components/ui/skeleton';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const categories = [
  { id: 'all', label: 'All', icon: Activity },
  { id: 'nutrition', label: 'Nutrition', icon: Heart },
  { id: 'fitness', label: 'Fitness', icon: TrendingUp },
  { id: 'mental-health', label: 'Mental Health', icon: Brain },
  { id: 'wellness', label: 'Wellness', icon: Activity }
];

const articles = [
  {
    id: '1',
    title: '10 Superfoods to Boost Your Immunity',
    category: 'nutrition',
    excerpt: 'Discover the power of natural foods that can strengthen your immune system and keep you healthy year-round.',
    image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    read_time: '5 min',
    author: 'Dr. Priya Sharma',
    date: '2025-12-28'
  },
  {
    id: '2',
    title: 'Morning Yoga: 15 Minutes to Transform Your Day',
    category: 'fitness',
    excerpt: 'Simple yoga routines that can energize your morning and improve flexibility, strength, and mental clarity.',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    read_time: '7 min',
    author: 'Amit Kumar',
    date: '2025-12-27'
  },
  {
    id: '3',
    title: 'Understanding Stress: Signs and Solutions',
    category: 'mental-health',
    excerpt: 'Learn to recognize stress signals in your body and discover effective techniques to manage daily pressures.',
    image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    read_time: '6 min',
    author: 'Dr. Anjali Mehta',
    date: '2025-12-26'
  },
  {
    id: '4',
    title: 'Sleep Better: The Science of Quality Rest',
    category: 'wellness',
    excerpt: 'Explore proven methods to improve your sleep quality and wake up refreshed every morning.',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800',
    read_time: '8 min',
    author: 'Dr. Rajesh Gupta',
    date: '2025-12-25'
  },
  {
    id: '5',
    title: 'Hydration: More Than Just Water',
    category: 'nutrition',
    excerpt: 'Understanding the importance of proper hydration and the best ways to stay hydrated throughout the day.',
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800',
    read_time: '4 min',
    author: 'Nutritionist Meera Reddy',
    date: '2025-12-24'
  },
  {
    id: '6',
    title: 'Building Core Strength at Home',
    category: 'fitness',
    excerpt: 'Effective exercises to strengthen your core without any equipment, perfect for busy schedules.',
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    read_time: '6 min',
    author: 'Fitness Coach Rahul Singh',
    date: '2025-12-23'
  },
  {
    id: '7',
    title: 'Mindfulness Meditation for Beginners',
    category: 'mental-health',
    excerpt: 'A simple guide to starting your meditation practice and experiencing the benefits of mindfulness.',
    image_url: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800',
    read_time: '5 min',
    author: 'Dr. Kavita Desai',
    date: '2025-12-22'
  },
  {
    id: '8',
    title: 'Healthy Habits for a Stronger Heart',
    category: 'wellness',
    excerpt: 'Learn lifestyle changes that can significantly reduce your risk of heart disease and improve cardiovascular health.',
    image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    read_time: '7 min',
    author: 'Dr. Suresh Patel',
    date: '2025-12-21'
  }
];

export default function HealthArticles() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: savedArticles = [] } = useQuery({
    queryKey: ['savedArticles'],
    queryFn: () => base44.entities.SavedArticle.list('-saved_date', 100),
    enabled: !!user
  });

  const saveArticle = useMutation({
    mutationFn: (article) => base44.entities.SavedArticle.create({
      article_id: article.id,
      title: article.title,
      category: article.category,
      content: article.excerpt,
      image_url: article.image_url,
      saved_date: new Date().toISOString().split('T')[0]
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedArticles'] })
  });

  const unsaveArticle = useMutation({
    mutationFn: (articleId) => {
      const saved = savedArticles.find(a => a.article_id === articleId);
      if (saved) return base44.entities.SavedArticle.delete(saved.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedArticles'] })
  });

  const isArticleSaved = (articleId) => {
    return savedArticles.some(a => a.article_id === articleId);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 px-4 pt-6 pb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Health Articles</h1>
        <p className="text-blue-100 text-sm">Expert insights for a healthier you</p>
        
        {/* Search Bar */}
        <div className="relative mt-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="pl-10 rounded-xl bg-white border-0"
          />
        </div>
      </div>

      {/* Saved Articles Link */}
      {savedArticles.length > 0 && (
        <div className="px-4 -mt-3 mb-4">
          <Link to={createPageUrl('SavedArticles')}>
            <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <BookmarkCheck size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Saved Articles</p>
                  <p className="text-xs text-gray-500">{savedArticles.length} articles saved</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </Link>
        </div>
      )}

      {/* Categories */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-500">
          {filteredArticles.length} articles found
        </p>
      </div>

      {/* Articles Grid */}
      <div className="px-4 pb-4 space-y-4">
        <AnimatePresence>
          {filteredArticles.map((article, index) => {
            const saved = isArticleSaved(article.id);
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Article Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => saved ? unsaveArticle.mutate(article.id) : saveArticle.mutate(article)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-colors"
                  >
                    {saved ? (
                      <BookmarkCheck size={20} className="text-yellow-600" />
                    ) : (
                      <Bookmark size={20} className="text-gray-600" />
                    )}
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 capitalize">
                      {article.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>{article.author}</span>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{article.read_time}</span>
                      </div>
                    </div>
                    <Link to={createPageUrl(`ArticleDetail?id=${article.id}`)}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-blue-600 hover:text-blue-700"
                      >
                        Read More →
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No articles found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}