import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Palette, Heart, Users, Compass, ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Welcome to the community!');
    onLogin();
  };

  if (showLogin || showSignup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3E5D0] via-[#CFE6F5] to-[#e8f4f0] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md p-8 shadow-xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-block mb-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#A8C3A0] to-[#D9A7A0] rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <h2>{showLogin ? 'Welcome Back' : 'Join the Community'}</h2>
              <p className="text-muted-foreground mt-2">
                {showLogin ? 'Continue your healing journey' : 'Start your transformation today'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-white"
                />
              </div>
              {showSignup && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    required
                    className="bg-white"
                  />
                </div>
              )}
              <Button type="submit" className="w-full">
                {showLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowLogin(!showLogin);
                  setShowSignup(!showSignup);
                }}
                className="text-sm text-[#A8C3A0] hover:underline"
              >
                {showLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>

            <button
              onClick={() => {
                setShowLogin(false);
                setShowSignup(false);
              }}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground w-full"
            >
              ← Back to home
            </button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5D0] via-[#CFE6F5] to-[#e8f4f0]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 bg-[#A8C3A0] rounded-full flex items-center justify-center shadow-2xl">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            Welcome to Your Healing Journey
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            A sacred space for transformation, growth, and authentic connection. 
            Join a community dedicated to healing, self-discovery, and empowerment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Button
              size="lg"
              onClick={() => setShowSignup(true)}
              className="bg-[#A8C3A0] hover:bg-[#8bb397] text-white shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowLogin(true)}
              className="shadow-md hover:shadow-lg transition-all"
            >
              Sign In
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto"
        >
          {[
            {
              icon: Users,
              title: 'Supportive Community',
              description: 'Connect with like-minded individuals on similar journeys of growth and healing.',
              color: '#A8C3A0'
            },
            {
              icon: Compass,
              title: 'Guided Programs',
              description: 'Structured pathways designed to support your personal transformation and wellness.',
              color: '#D9A7A0'
            },
            {
              icon: Palette,
              title: 'Healing Art Gallery',
              description: 'Express yourself through art and discover how creativity becomes medicine.',
              color: '#CFE6F5'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="cursor-pointer"
            >
              <Card className="p-6 h-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-md" style={{ backgroundColor: feature.color }}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-20 max-w-3xl mx-auto text-center"
        >
          <Card className="p-12 bg-white/80 backdrop-blur-sm shadow-xl">
            <h2 className="mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe that healing is not a destination, but a journey. Our platform was created 
              to provide a safe, nurturing space where individuals can explore their inner world, 
              connect with others, and access resources that support genuine transformation. 
              Every feature, every program, and every connection is designed with intention and care.
            </p>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-block p-8 rounded-3xl bg-[#A8C3A0] shadow-2xl">
            <h2 className="text-white mb-4">Ready to Begin?</h2>
            <p className="text-white/90 mb-6 max-w-xl">
              Join thousands of others who are choosing growth, healing, and authentic living.
            </p>
            <Button
              size="lg"
              onClick={() => setShowSignup(true)}
              className="bg-white text-[#505A5B] hover:bg-gray-100 shadow-lg"
            >
              Join the Community
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
