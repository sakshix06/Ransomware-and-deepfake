
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 pb-10 relative overflow-hidden">
      {/* Background Design Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-ransomguard-purple/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-ransomguard-blue/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-gray-800">
              <span className="bg-ransomguard-purple text-white text-xs font-medium px-2 py-1 rounded-full">NEW</span>
              <span className="text-sm text-gray-300">Protecting against the latest RaaS threats</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Protect Your Data from <span className="gradient-text">Ransomware & RaaS Attacks</span>
            </h1>
            
            <p className="text-gray-300 text-lg max-w-lg">
              Our AI-powered solution detects, stops, and recovers from ransomware attacks in real-time, keeping your critical data safe from cyber criminals.
            </p>
            
            <div className="flex gap-4">
              <Link to="/signup">
                <Button className="hero-button" size="lg">
                  Start Protection <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/learn-more">
                <Button variant="outline" className="px-6 py-3" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-ransomguard-purple h-5 w-5" />
                <span className="text-gray-300 text-sm">99.9% Detection Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-ransomguard-purple h-5 w-5" />
                <span className="text-gray-300 text-sm">24/7 Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-ransomguard-purple h-5 w-5" />
                <span className="text-gray-300 text-sm">1-Click Recovery</span>
              </div>
            </div>
          </div>
          
          <div className="order-first md:order-last flex justify-center animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-ransomguard-purple to-ransomguard-blue rounded-xl blur-xl opacity-50"></div>
              <div className="relative bg-ransomguard-dark-bg border border-gray-800 p-1 rounded-xl">
                <img src="https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80&w=600&h=500" 
                  alt="Cybersecurity Dashboard" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-ransomguard-dark-bg border border-gray-800 p-4 rounded-lg shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <ShieldCheck className="text-green-500 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">System Protected</p>
                    <p className="text-xs text-gray-400">Last scan: Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
