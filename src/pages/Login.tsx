
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogIn } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ParticlesBackground } from '@/components/dashboard/ParticlesBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.fullName || 'User'}`,
      });
      
      setTimeout(() => navigate('/'), 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ransomguard-dark-bg relative overflow-hidden">
      <ParticlesBackground />
      
      <div className="flex items-center justify-between px-6 py-4 relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-ransomguard-purple" />
          <span className="font-bold text-lg">Ransom<span className="text-ransomguard-purple">Guard</span></span>
        </Link>
        <Link to="/signup">
          <Button variant="outline">Create Account</Button>
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold gradient-text">Welcome Back</h2>
            <p className="mt-2 text-gray-400">Sign in to continue to RansomGuard</p>
          </div>
          
          <motion.div 
            whileHover={{ boxShadow: "0px 0px 30px rgba(155,135,245,0.15)" }}
            className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800 shadow-xl transition-all duration-300"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-gray-800/50 border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-ransomguard-purple hover:text-ransomguard-deep-purple">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-gray-800/50 border-gray-700"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                >
                  Remember me
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-ransomguard-purple hover:bg-ransomguard-deep-purple" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-white"></span>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-ransomguard-purple hover:text-ransomguard-deep-purple font-medium transition-colors">
                  Sign up now
                </Link>
              </div>
            </form>
          </motion.div>
          
          <div className="text-center text-xs text-gray-500 mt-8">
            <p>Protected by RansomGuard © {new Date().getFullYear()}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
