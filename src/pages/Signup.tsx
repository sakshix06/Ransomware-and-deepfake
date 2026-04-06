
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ParticlesBackground } from '@/components/dashboard/ParticlesBackground';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }
    
    if (!agreedTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to our terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Save token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast({
        title: "Account Created Successfully",
        description: `Welcome to RansomGuard, ${data.user.fullName || 'User'}`,
      });
      
      setTimeout(() => navigate('/'), 1000);
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: error.message || "There was an error creating your account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { score: 0, label: '', color: 'bg-gray-700' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (pass.length < 10) return { score: 2, label: 'Medium', color: 'bg-yellow-500' };
    return { score: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex flex-col bg-ransomguard-dark-bg relative overflow-hidden">
      <ParticlesBackground />
      
      <div className="flex items-center justify-between px-6 py-4 relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-ransomguard-purple" />
          <span className="font-bold text-lg">Ransom<span className="text-ransomguard-purple">Guard</span></span>
        </Link>
        <Link to="/login">
          <Button variant="outline">Sign In</Button>
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold gradient-text">Create Account</h2>
            <p className="mt-2 text-gray-400">Join RansomGuard and secure your data</p>
          </div>
          
          <motion.div 
            whileHover={{ boxShadow: "0px 0px 30px rgba(155,135,245,0.15)" }}
            className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800 shadow-xl transition-all duration-300"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="bg-gray-800/50 border-gray-700"
                />
              </div>
              
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-gray-800/50 border-gray-700"
                />
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">Password strength</span>
                      <span className={`text-xs font-medium ${strength.score > 1 ? 'text-green-400' : strength.score === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-l-full ${strength.score >= 1 ? strength.color : 'bg-transparent transition-colors duration-300'}`}></div>
                      <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-transparent transition-colors duration-300'}`}></div>
                      <div className={`h-full flex-1 rounded-r-full ${strength.score >= 3 ? strength.color : 'bg-transparent transition-colors duration-300'}`}></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-gray-800/50 border-gray-700"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedTerms}
                  onCheckedChange={(checked) => setAgreedTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                >
                  I agree to the{' '}
                  <Link to="/terms" className="text-ransomguard-purple hover:text-ransomguard-deep-purple">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-ransomguard-purple hover:text-ransomguard-deep-purple">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-ransomguard-purple hover:bg-ransomguard-deep-purple" 
                disabled={isLoading || !agreedTerms}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-white"></span>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </span>
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-ransomguard-purple hover:text-ransomguard-deep-purple font-medium transition-colors">
                  Sign in
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

export default Signup;
