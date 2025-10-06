import { motion } from './motion-wrapper';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Home, 
  Compass, 
  Users, 
  Palette, 
  ArrowRight,
  Calendar,
  TrendingUp,
  Heart
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'programs' | 'community' | 'gallery') => void;
}

const programs = [
  { id: 1, name: 'Mindful Mornings', progress: 75, color: '#A8C3A0', icon: '🌅' },
  { id: 2, name: 'Inner Peace Journey', progress: 45, color: '#D9A7A0', icon: '🧘' },
  { id: 3, name: 'Emotional Wellness', progress: 60, color: '#CFE6F5', icon: '💙' },
];

const upcomingSessions = [
  { id: 1, title: 'Group Meditation', time: 'Today at 6:00 PM', attendees: 12 },
  { id: 2, title: 'Healing Circle', time: 'Tomorrow at 10:00 AM', attendees: 8 },
  { id: 3, title: 'Wellness Workshop', time: 'Friday at 3:00 PM', attendees: 15 },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-2">Welcome back, Jordan! 🌟</h1>
          <p className="text-muted-foreground">
            You're making amazing progress on your journey. Keep going!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-3 gap-4"
            >
              <Card className="p-6 bg-[#A8C3A0] text-white shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">Active Programs</span>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-3xl font-semibold">3</div>
              </Card>
              <Card className="p-6 bg-[#D9A7A0] text-white shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">Days Streak</span>
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-3xl font-semibold">21</div>
              </Card>
              <Card className="p-6 bg-[#CFE6F5] text-white shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">Connections</span>
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-3xl font-semibold">47</div>
              </Card>
            </motion.div>

            {/* Programs Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3>Your Programs</h3>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate('programs')}>
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-6">
                  {programs.map((program, index) => (
                    <motion.div
                      key={program.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center text-2xl shadow-md" 
                          style={{ backgroundColor: program.color, justifyContent: 'center' } as React.CSSProperties}
                        >
                          {program.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4>{program.name}</h4>
                            <span className="text-sm text-muted-foreground">{program.progress}%</span>
                          </div>
                          <Progress value={program.progress} className="h-2" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 gap-4"
            >
              <Card 
                className="p-6 bg-gradient-to-br from-[#e8f4f0] to-[#f3dcd2] cursor-pointer hover:shadow-lg transition-all"
                onClick={() => onNavigate('gallery')}
              >
                <Palette className="w-10 h-10 text-[#A8C3A0] mb-3" />
                <h4 className="mb-2">Share Your Art</h4>
                <p className="text-sm text-muted-foreground">Express yourself through creative healing</p>
              </Card>
              <Card 
                className="p-6 bg-gradient-to-br from-[#e0f1fa] to-[#e8f4f0] cursor-pointer hover:shadow-lg transition-all"
                onClick={() => onNavigate('community')}
              >
                <Users className="w-10 h-10 text-[#CFE6F5] mb-3" />
                <h4 className="mb-2">Join Discussion</h4>
                <p className="text-sm text-muted-foreground">Connect with the community</p>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 shadow-lg text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-[#A8C3A0] text-white text-2xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <h3 className="mb-1">Jordan Davis</h3>
                <p className="text-sm text-muted-foreground mb-4">Healing Journey Explorer</p>
                <Badge className="mb-4">Level 5 Seeker</Badge>
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </Card>
            </motion.div>

            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 shadow-lg">
                <h3 className="mb-4">Upcoming Sessions</h3>
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="p-3 bg-gradient-to-r from-[#e8f4f0] to-[#f3dcd2] rounded-lg cursor-pointer"
                    >
                      <h4 className="text-sm mb-1">{session.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{session.time}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{session.attendees} attending</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
