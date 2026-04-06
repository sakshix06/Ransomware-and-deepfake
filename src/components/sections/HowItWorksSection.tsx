
import React from 'react';
import { Shield, FileSearch, DatabaseBackup } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <FileSearch className="h-12 w-12 text-ransomguard-purple" />,
      title: 'Detect Threats',
      description: 'Our advanced AI algorithms continuously monitor your systems to detect suspicious activities and ransomware signatures in real-time.',
      highlight: 'Real-time scanning with AI pattern recognition'
    },
    {
      icon: <Shield className="h-12 w-12 text-ransomguard-purple" />,
      title: 'Isolate & Neutralize',
      description: 'When a threat is detected, RansomGuard immediately isolates the affected systems to prevent spread while neutralizing the attack.',
      highlight: 'Automatic containment to prevent lateral movement'
    },
    {
      icon: <DatabaseBackup className="h-12 w-12 text-ransomguard-purple" />,
      title: 'Restore & Recover',
      description: 'Quickly restore your systems from secure backups with our one-click recovery process, minimizing downtime and data loss.',
      highlight: 'Intelligent restoration with version history'
    }
  ];

  return (
    <section id="how-it-works" className="section-container">
      <h2 className="section-title">How RansomGuard Works</h2>
      <p className="text-gray-300 text-center max-w-2xl mx-auto mb-16">
        Our three-step protection process ensures your data remains secure against even the most sophisticated ransomware attacks.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-gradient-to-b from-gray-900 to-ransomguard-dark-bg border border-gray-800 rounded-xl p-6 group hover:border-ransomguard-purple/40 transition-all duration-300">
            <div className="bg-gray-800/50 rounded-full w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-ransomguard-purple/10 transition-colors">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-gray-300 mb-4">{step.description}</p>
            <div className="bg-white/5 border border-gray-800 rounded-lg p-3">
              <p className="text-sm text-ransomguard-purple font-medium">{step.highlight}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-24 max-w-4xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-ransomguard-purple to-ransomguard-blue opacity-30 blur-xl rounded-xl"></div>
        <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4">Continuous Protection Cycle</h3>
              <p className="text-gray-300">
                RansomGuard doesn't just react to attacks - it continuously learns and improves, adapting to new threats and strengthening your defenses over time.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?auto=format&fit=crop&q=80&w=600&h=350" 
                  alt="Protection Cycle" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
