import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Home, 
  Compass, 
  Users, 
  Palette, 
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CommunityProps {
  onNavigate: (page: 'dashboard' | 'programs' | 'community' | 'gallery') => void;
}

const posts = [
  {
    id: 1,
    author: 'Sarah Mitchell',
    avatar: 'SM',
    time: '2 hours ago',
    content: 'Just completed my first week of the Mindful Mornings program and I already feel such a shift in my energy. Starting the day with intention has been transformative. 🌅✨',
    likes: 24,
    comments: 7,
    badge: 'Journey Guide'
  },
  {
    id: 2,
    author: 'Alex Chen',
    avatar: 'AC',
    time: '5 hours ago',
    content: 'Reminder: Your healing journey is unique to you. Comparison is the thief of joy. Celebrate every small victory, every moment of awareness, every breath taken with intention. 💙',
    likes: 42,
    comments: 12,
    badge: 'Wellness Warrior'
  },
  {
    id: 3,
    author: 'Maya Rodriguez',
    avatar: 'MR',
    time: '1 day ago',
    content: 'Grateful for this community. You all inspire me every single day to show up for myself, even when it\'s hard. Thank you for being a safe space. 🙏',
    likes: 56,
    comments: 18,
    badge: 'Heart Healer'
  },
  {
    id: 4,
    author: 'Jordan Davis',
    avatar: 'JD',
    time: '2 days ago',
    content: 'Today I chose rest over productivity, and it felt like an act of rebellion. Learning that self-care isn\'t selfish—it\'s necessary. 💗',
    likes: 38,
    comments: 9,
    badge: 'Level 5 Seeker'
  },
];

const examMessage = {
  title: 'Weekly Reflection Check-in',
  description: 'Take a moment to reflect on your journey this week. What insights have you gained? What challenges have you faced?',
  dueDate: 'Due in 3 days'
};

export default function Community({ onNavigate }: CommunityProps) {
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const handleLike = (postId: number) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
      toast.success('Post liked!');
    }
    setLikedPosts(newLiked);
  };

  const handlePost = () => {
    if (newPost.trim()) {
      toast.success('Your thoughts have been shared with the community!');
      setNewPost('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5D0] via-[#CFE6F5] to-[#e8f4f0]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#A8C3A0] rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold">Healing Hub</span>
              </div>
              <div className="hidden md:flex gap-6">
                <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('programs')}>
                  <Compass className="w-4 h-4 mr-2" />
                  Programs
                </Button>
                <Button variant="ghost" className="bg-[#e8f4f0]">
                  <Users className="w-4 h-4 mr-2" />
                  Community
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('gallery')}>
                  <Palette className="w-4 h-4 mr-2" />
                  Gallery
                </Button>
              </div>
            </div>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-[#A8C3A0] text-white">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-2">Community Circle</h1>
          <p className="text-muted-foreground">
            Share, connect, and support each other on this healing journey
          </p>
        </motion.div>

        {/* Exam/Reflection Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3>{examMessage.title}</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  {examMessage.description}
                </p>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {examMessage.dueDate}
                </Badge>
              </div>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                Start Reflection
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-6 shadow-lg">
            <div className="flex gap-4">
              <Avatar>
                <AvatarFallback className="bg-[#A8C3A0] text-white">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your thoughts, insights, or questions with the community..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="mb-3 min-h-[100px] resize-none"
                />
                <div className="flex justify-end">
                  <Button onClick={handlePost} disabled={!newPost.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-[#CFE6F5] text-[#505A5B]">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4>{post.author}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {post.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{post.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <p className="mb-4 leading-relaxed">{post.content}</p>

                    <div className="flex items-center gap-6">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-[#D9A7A0] transition-colors"
                      >
                        <Heart 
                          className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-[#D9A7A0] text-[#D9A7A0]' : ''}`}
                        />
                        <span className="text-sm">
                          {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                        </span>
                      </motion.button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-[#CFE6F5] transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-[#A8C3A0] transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Encouragement Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Card className="p-8 bg-[#CFE6F5]/30">
            <Heart className="w-12 h-12 text-[#A8C3A0] mx-auto mb-4" />
            <h3 className="mb-2">You Are Not Alone</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This is a space of compassion, understanding, and growth. Share your journey, 
              support others, and remember that every voice here matters.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
