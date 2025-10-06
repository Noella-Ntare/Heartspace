import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { motion } from './motion-wrapper';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { 
  Home, 
  Compass, 
  Users, 
  Sparkles, 
  Heart,
  Upload,
  Eye,
  MessageCircle,
  X,
  Palette
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface GalleryProps {
  onNavigate: (page: 'dashboard' | 'programs' | 'community' | 'gallery') => void;
}

const artworks = [
  {
    id: 1,
    title: 'Breaking Free',
    artist: 'Sarah Mitchell',
    artistAvatar: 'SM',
    category: 'Painting',
    query: 'abstract colorful painting',
    description: 'This piece represents my journey of breaking free from past trauma. Each color represents a different emotion I processed.',
    story: 'Creating this helped me express feelings I couldn\'t put into words. The act of painting became my therapy.',
    likes: 142,
    views: 1203,
    comments: 28,
    featured: true
  },
  {
    id: 2,
    title: 'Inner Light',
    artist: 'Alex Chen',
    artistAvatar: 'AC',
    category: 'Photography',
    query: 'sunset golden light person',
    description: 'A photograph capturing the moment I realized my own inner strength.',
    story: 'Photography taught me to see beauty in darkness and find light within myself.',
    likes: 98,
    views: 856,
    comments: 15
  },
  {
    id: 3,
    title: 'Rebirth',
    artist: 'Maya Rodriguez',
    artistAvatar: 'MR',
    category: 'Digital Art',
    query: 'phoenix bird transformation',
    description: 'Digital illustration of transformation and renewal.',
    story: 'This represents my journey of rising from the ashes of depression into a new version of myself.',
    likes: 203,
    views: 1542,
    comments: 42
  },
  {
    id: 4,
    title: 'Layers of Healing',
    artist: 'Jordan Davis',
    artistAvatar: 'JD',
    category: 'Mixed Media',
    query: 'layered texture art therapy',
    description: 'Each layer represents a stage of healing - peeling back to reveal what\'s underneath.',
    story: 'Working with textures helped me understand that healing happens in layers, not all at once.',
    likes: 167,
    views: 1104,
    comments: 31
  },
  {
    id: 5,
    title: 'Ocean of Emotions',
    artist: 'Emma Wilson',
    artistAvatar: 'EW',
    category: 'Painting',
    query: 'ocean waves watercolor blue',
    description: 'Watercolor piece exploring the depths of emotion.',
    story: 'Painting water taught me that emotions, like waves, come and go. Nothing is permanent.',
    likes: 189,
    views: 1367,
    comments: 37
  },
  {
    id: 6,
    title: 'Garden of Growth',
    artist: 'Lucas Kim',
    artistAvatar: 'LK',
    category: 'Photography',
    query: 'garden flowers bloom nature',
    description: 'A photographic study of growth and new beginnings.',
    story: 'Watching plants grow taught me patience with my own healing journey.',
    likes: 124,
    views: 932,
    comments: 19
  },
  {
    id: 7,
    title: 'Fractured but Whole',
    artist: 'Olivia Park',
    artistAvatar: 'OP',
    category: 'Sculpture',
    query: 'broken pottery kintsugi gold',
    description: 'Inspired by kintsugi, finding beauty in brokenness.',
    story: 'This piece taught me that my scars don\'t diminish my worth - they add to my story.',
    likes: 256,
    views: 1876,
    comments: 53,
    featured: true
  },
  {
    id: 8,
    title: 'Mindful Moments',
    artist: 'Noah Anderson',
    artistAvatar: 'NA',
    category: 'Digital Art',
    query: 'meditation zen peaceful abstract',
    description: 'Digital mandala created during meditation practice.',
    story: 'Creating mandalas became my moving meditation, helping me stay present.',
    likes: 145,
    views: 1089,
    comments: 24
  }
];

const categories = ['All', 'Painting', 'Photography', 'Digital Art', 'Sculpture', 'Mixed Media', 'Drawing'];

export default function Gallery({ onNavigate }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArt, setSelectedArt] = useState<typeof artworks[0] | null>(null);
  const [likedArt, setLikedArt] = useState<Set<number>>(new Set());
  const [showUpload, setShowUpload] = useState(false);

  const filteredArtworks = selectedCategory === 'All' 
    ? artworks 
    : artworks.filter(art => art.category === selectedCategory);

  const handleLike = (artId: number) => {
    const newLiked = new Set(likedArt);
    if (newLiked.has(artId)) {
      newLiked.delete(artId);
    } else {
      newLiked.add(artId);
      toast.success('Added to your favorites!');
    }
    setLikedArt(newLiked);
  };

  const handleUpload = () => {
    toast.success('Your artwork has been shared with the community!');
    setShowUpload(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5D0] via-[#CFE6F5] to-[#e8f4f0]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#A8C3A0] rounded-full flex-center">
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
                <Button variant="ghost" onClick={() => onNavigate('community')}>
                  <Users className="w-4 h-4 mr-2" />
                  Community
                </Button>
                <Button variant="ghost" className="bg-[#e8f4f0]">
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

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="mb-2">Healing Through Art</h1>
              <p className="text-muted-foreground">
                A space where creativity becomes medicine and expression leads to healing
              </p>
            </div>
            <Button 
              onClick={() => setShowUpload(true)}
              className="bg-[#A8C3A0] hover:bg-[#8bb397] text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Share Your Art
            </Button>
          </div>
        </motion.div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="overflow-hidden shadow-xl bg-[#A8C3A0] p-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-white" />
              <h2 className="text-white">Art of the Week</h2>
            </div>
            <p className="text-white/90 mb-4">
              Featured artwork selected by our community for its powerful healing message and creative expression.
            </p>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30">
                Community Choice
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 flex-wrap mb-8"
        >
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-[#CFE6F5]/50 transition-colors px-4 py-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="cursor-pointer"
              onClick={() => setSelectedArt(artwork)}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full">
                <div className="aspect-square relative overflow-hidden bg-[#F3E5D0]">
                  <ArtImage query={artwork.query} />
                  {artwork.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#F3E5D0] text-[#505A5B] border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="mb-1">{artwork.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-[#CFE6F5] text-[#505A5B] text-xs">
                        {artwork.artistAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{artwork.artist}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {artwork.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className={`w-4 h-4 ${likedArt.has(artwork.id) ? 'fill-[#D9A7A0] text-[#D9A7A0]' : ''}`} />
                      <span>{artwork.likes + (likedArt.has(artwork.id) ? 1 : 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{artwork.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{artwork.comments}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* About Art Therapy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
              <Palette className="w-12 h-12 text-[#A8C3A0] mx-auto mb-4" />
              <h2 className="mb-4">The Healing Power of Art</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Art therapy is a powerful tool for emotional healing and self-expression. 
                Through creating and sharing art, we process emotions, tell our stories, 
                and connect with others on a deeply authentic level. Every piece in this 
                gallery represents a journey of courage, vulnerability, and transformation.
              </p>
              <div className="flex items-center flex-jc gap-2 text-[#A8C3A0]">
                <Heart className="w-5 h-5" />
                <span>Your art matters. Your story matters. You matter.</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Artwork Detail Modal */}
      <AnimatePresence>
        {selectedArt && (
          <Dialog open={!!selectedArt} onOpenChange={() => setSelectedArt(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedArt.title}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-[#F3E5D0]">
                  <ArtImage query={selectedArt.query} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-[#CFE6F5] text-[#505A5B]">
                        {selectedArt.artistAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4>{selectedArt.artist}</h4>
                      <Badge variant="secondary" className="mt-1">
                        {selectedArt.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="mb-2">About This Piece</h3>
                    <p className="text-muted-foreground">{selectedArt.description}</p>
                  </div>

                  <div className="mb-6 p-4 bg-[#CFE6F5]/30 rounded-lg">
                    <h4 className="mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#D9A7A0]" />
                      Healing Story
                    </h4>
                    <p className="text-sm text-muted-foreground italic">
                      "{selectedArt.story}"
                    </p>
                  </div>

                  <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(selectedArt.id)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-[#D9A7A0] transition-colors"
                    >
                      <Heart 
                        className={`w-6 h-6 ${likedArt.has(selectedArt.id) ? 'fill-[#D9A7A0] text-[#D9A7A0]' : ''}`}
                      />
                      <span>{selectedArt.likes + (likedArt.has(selectedArt.id) ? 1 : 0)} likes</span>
                    </motion.button>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="w-6 h-6" />
                      <span>{selectedArt.views} views</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3">{selectedArt.comments} Comments</h4>
                    <Textarea 
                      placeholder="Share how this artwork speaks to you..."
                      className="mb-3"
                    />
                    <Button size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Healing Art</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Artwork Title</label>
              <input 
                type="text" 
                placeholder="Give your art a name..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2">Category</label>
              <select className="w-full px-3 py-2 border rounded-lg">
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Description</label>
              <Textarea 
                placeholder="What does this piece represent to you?"
                className="min-h-[100px]"
              />
            </div>
            <div>
              <label className="block mb-2">Your Healing Story</label>
              <Textarea 
                placeholder="How did creating this art help you heal? (Optional)"
                className="min-h-[100px]"
              />
            </div>
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-[#A8C3A0] transition-colors">
              <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">Click to upload your artwork</p>
              <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
            </div>
            <Button onClick={handleUpload} className="w-full">
              Share with Community
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ArtImage({ query }: { query: string }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    setTimeout(() => {
      setImageUrl(`https://source.unsplash.com/800x800/?${query}`);
      setIsLoading(false);
    }, 100);
  });

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="w-full h-full bg-[#F3E5D0] animate-pulse" />
      ) : (
        <ImageWithFallback
          src={imageUrl}
          alt={query}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
