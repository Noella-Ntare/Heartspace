import { useState } from 'react';
import { motion } from './motion-wrapper';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Home, 
  Compass, 
  Users, 
  Palette, 
  Heart,
  Clock,
  Star,
  CheckCircle2,
  Play
} from 'lucide-react';

interface ProgramsProps {
  onNavigate: (page: 'dashboard' | 'programs' | 'community' | 'gallery') => void;
}

const allPrograms = [
  {
    id: 1,
    name: 'Mindful Mornings',
    description: 'Start each day with intention, clarity, and peace through guided morning practices.',
    duration: '21 days',
    level: 'Beginner',
    enrolled: true,
    progress: 75,
    participants: 234,
    icon: '🌅',
    color: '#A8C3A0',
    modules: 21
  },
  {
    id: 2,
    name: 'Inner Peace Journey',
    description: 'Explore meditation, breathwork, and mindfulness to cultivate lasting inner peace.',
    duration: '30 days',
    level: 'Intermediate',
    enrolled: true,
    progress: 45,
    participants: 189,
    icon: '🧘',
    color: '#D9A7A0',
    modules: 30
  },
  {
    id: 3,
    name: 'Emotional Wellness',
    description: 'Learn tools to process emotions healthily and build emotional resilience.',
    duration: '6 weeks',
    level: 'All Levels',
    enrolled: true,
    progress: 60,
    participants: 312,
    icon: '💙',
    color: '#CFE6F5',
    modules: 42
  },
  {
    id: 4,
    name: 'Heart Healing',
    description: 'A compassionate journey through healing past wounds and opening to love.',
    duration: '8 weeks',
    level: 'Intermediate',
    enrolled: false,
    progress: 0,
    participants: 156,
    icon: '💗',
    color: '#D9A7A0',
    modules: 56
  },
  {
    id: 5,
    name: 'Self-Love Mastery',
    description: 'Develop a deep, authentic relationship with yourself through daily practices.',
    duration: '4 weeks',
    level: 'Beginner',
    enrolled: false,
    progress: 0,
    participants: 278,
    icon: '✨',
    color: '#F3E5D0',
    modules: 28
  },
  {
    id: 6,
    name: 'Authentic Expression',
    description: 'Find your voice and express your truth with confidence and clarity.',
    duration: '5 weeks',
    level: 'All Levels',
    enrolled: false,
    progress: 0,
    participants: 198,
    icon: '🎨',
    color: '#A8C3A0',
    modules: 35
  },
];

export default function Programs({ onNavigate }: ProgramsProps) {
  const [filter, setFilter] = useState<'all' | 'enrolled'>('all');

  const filteredPrograms = filter === 'enrolled' 
    ? allPrograms.filter(p => p.enrolled)
    : allPrograms;

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
                <Button variant="ghost" className="bg-[#e8f4f0]">
                  <Compass className="w-4 h-4 mr-2" />
                  Programs
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('community')}>
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

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-2">Healing Programs</h1>
          <p className="text-muted-foreground mb-6">
            Structured pathways designed to support your transformation and growth
          </p>

          <div className="flex gap-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Programs
            </Button>
            <Button
              variant={filter === 'enrolled' ? 'default' : 'outline'}
              onClick={() => setFilter('enrolled')}
            >
              My Programs
            </Button>
          </div>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="cursor-pointer"
            >
              <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <div 
                  className="h-32 flex items-center text-6xl" 
                  style={{ backgroundColor: program.color, justifyContent: 'center' } as React.CSSProperties}
                >
                  {program.icon}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="mb-1">{program.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {program.level}
                      </Badge>
                    </div>
                    {program.enrolled && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {program.description}
                  </p>

                  {program.enrolled && program.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">{program.progress}%</span>
                      </div>
                      <Progress value={program.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{program.participants}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    variant={program.enrolled ? 'default' : 'outline'}
                  >
                    {program.enrolled ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Enroll Now
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Message Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="p-8 bg-[#A8C3A0] text-white shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-white mb-4">Every Journey Begins With a Single Step</h2>
              <p className="text-white/90 mb-6">
                These programs are designed with care and intention to support you wherever you are 
                on your path. Remember: healing is not linear, and every step forward is progress.
              </p>
              <div className="flex items-center flex-jc gap-2 text-white/80">
                <Heart className="w-5 h-5" />
                <span>Choose compassion. Choose growth. Choose yourself.</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
