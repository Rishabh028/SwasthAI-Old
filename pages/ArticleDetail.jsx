import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Clock, Bookmark, BookmarkCheck, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Sample article data - in real app this would come from URL params
const getArticleById = (id) => {
  const articles = {
    '1': {
      id: '1',
      title: '10 Superfoods to Boost Your Immunity',
      category: 'nutrition',
      content: `Building a strong immune system is crucial for maintaining good health. Here are 10 superfoods that can help boost your immunity naturally:

**1. Citrus Fruits**
Rich in Vitamin C, citrus fruits like oranges, lemons, and grapefruits help increase white blood cell production, which is key to fighting infections.

**2. Turmeric**
This golden spice contains curcumin, a powerful anti-inflammatory compound that enhances antibody responses and regulates immune cell function.

**3. Ginger**
Known for its anti-inflammatory properties, ginger helps decrease chronic pain and may even possess cholesterol-lowering properties.

**4. Garlic**
Garlic's immune-boosting properties come from its heavy concentration of sulfur-containing compounds like allicin.

**5. Spinach**
Packed with vitamin C, antioxidants, and beta carotene, spinach may increase the infection-fighting ability of our immune systems.

**6. Yogurt**
Look for yogurts that have "live and active cultures" printed on the label. These cultures stimulate your immune system to fight diseases.

**7. Almonds**
Rich in vitamin E, almonds are key to a healthy immune system. Just a half-cup serving provides nearly 100% of the recommended daily amount.

**8. Green Tea**
Both green and black teas are packed with flavonoids, but green tea really excels in levels of EGCG, another powerful antioxidant.

**9. Papaya**
Papayas have decent amounts of potassium, folate, and vitamin C, all of which are beneficial to your overall health.

**10. Blueberries**
Blueberries contain a type of flavonoid called anthocyanin, which has antioxidant properties that can help boost the immune system.

**How to Incorporate These Foods**
- Start your day with a smoothie containing berries and spinach
- Add turmeric to your curries and soups
- Snack on almonds and citrus fruits
- Include garlic in your cooking
- Have yogurt as a healthy dessert option

Remember, while these foods can support your immune system, they work best as part of a balanced diet combined with regular exercise, adequate sleep, and stress management.`,
      image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      read_time: '5 min',
      author: 'Dr. Priya Sharma',
      date: '2025-12-28'
    },
    '2': {
      id: '2',
      title: 'Morning Yoga: 15 Minutes to Transform Your Day',
      category: 'fitness',
      content: `Starting your day with yoga can set a positive tone for the entire day. Here's a simple 15-minute routine that anyone can follow.

**Benefits of Morning Yoga**
- Increases flexibility and strength
- Improves posture and balance
- Reduces stress and anxiety
- Boosts energy levels
- Enhances mental clarity

**The 15-Minute Routine**

**1. Mountain Pose (2 minutes)**
Stand tall with feet together, shoulders relaxed, weight evenly distributed. Take deep breaths.

**2. Sun Salutation (5 minutes)**
Perform 3-5 rounds of sun salutations to warm up your entire body.

**3. Downward Dog (2 minutes)**
Great for stretching the entire back of your body and strengthening arms.

**4. Warrior II (2 minutes)**
Builds strength in legs and opens hips and chest.

**5. Tree Pose (2 minutes)**
Improves balance and strengthens legs.

**6. Child's Pose (2 minutes)**
Rest and recover while stretching your back and hips.

**Tips for Success**
- Practice on an empty stomach
- Use a yoga mat for comfort
- Focus on your breathing
- Don't force any poses
- Be consistent

Make yoga a daily habit and watch how it transforms your physical and mental wellbeing.`,
      image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      read_time: '7 min',
      author: 'Amit Kumar',
      date: '2025-12-27'
    }
  };
  return articles[id] || articles['1'];
};

export default function ArticleDetail() {
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  // Get article ID from URL
  const articleId = new URLSearchParams(window.location.search).get('id') || '1';
  const article = getArticleById(articleId);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: savedArticles = [] } = useQuery({
    queryKey: ['savedArticles'],
    queryFn: () => base44.entities.SavedArticle.list('-saved_date', 100),
    enabled: !!user
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['articleComments', articleId],
    queryFn: () => base44.entities.ArticleComment.filter({ article_id: articleId }, '-created_date', 100),
    enabled: !!user
  });

  const saveArticle = useMutation({
    mutationFn: () => base44.entities.SavedArticle.create({
      article_id: article.id,
      title: article.title,
      category: article.category,
      content: article.content.substring(0, 200),
      image_url: article.image_url,
      saved_date: new Date().toISOString().split('T')[0]
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedArticles'] })
  });

  const unsaveArticle = useMutation({
    mutationFn: () => {
      const saved = savedArticles.find(a => a.article_id === articleId);
      if (saved) return base44.entities.SavedArticle.delete(saved.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedArticles'] })
  });

  const postComment = useMutation({
    mutationFn: () => base44.entities.ArticleComment.create({
      article_id: articleId,
      content: comment,
      author_name: user?.full_name || 'Anonymous'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articleComments', articleId] });
      setComment('');
    }
  });

  const isArticleSaved = savedArticles.some(a => a.article_id === articleId);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <Link to={createPageUrl('HealthArticles')}>
            <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => isArticleSaved ? unsaveArticle.mutate() : saveArticle.mutate()}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isArticleSaved ? (
                <BookmarkCheck size={20} className="text-yellow-600" />
              ) : (
                <Bookmark size={20} className="text-gray-600" />
              )}
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Share2 size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="px-4 py-6">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-4 capitalize">
          {article.category.replace('-', ' ')}
        </span>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{article.title}</h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span>{article.author}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{article.read_time}</span>
          </div>
          <span>•</span>
          <span>{article.date}</span>
        </div>

        {/* Featured Image */}
        <img 
          src={article.image_url} 
          alt={article.title}
          className="w-full h-64 object-cover rounded-2xl mb-6"
        />

        {/* Article Body */}
        <div className="prose prose-sm max-w-none">
          {article.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <h3 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3">
                  {paragraph.replace(/\*\*/g, '')}
                </h3>
              );
            }
            return (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph.split('**').map((text, i) => 
                  i % 2 === 1 ? <strong key={i}>{text}</strong> : text
                )}
              </p>
            );
          })}
        </div>

        {/* Comments Section */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={20} className="text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Comments ({comments.length})</h2>
          </div>

          {/* Comment Form */}
          {user && (
            <div className="mb-6">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="rounded-xl mb-3"
                rows={3}
              />
              <Button
                onClick={() => postComment.mutate()}
                disabled={!comment.trim() || postComment.isPending}
                className="rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                Post Comment
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((c, index) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">
                      {c.author_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{c.author_name}</p>
                    <p className="text-gray-700 text-sm mt-1">{c.content}</p>
                    <button className="flex items-center gap-1 text-xs text-gray-500 mt-2 hover:text-blue-600">
                      <ThumbsUp size={12} />
                      <span>{c.upvotes || 0}</span>
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