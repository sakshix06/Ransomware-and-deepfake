import React from 'react';
import { Users } from 'lucide-react';

const AboutSection = () => {
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Project Lead",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200&fit=facearea&facepad=2"
    },
    {
      name: "Jamie Rodriguez",
      role: "Security Researcher",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200&fit=facearea&facepad=2"
    },
    {
      name: "Raj Patel",
      role: "AI Engineer",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200&h=200&fit=facearea&facepad=2"
    },
    {
      name: "Taylor Morgan",
      role: "Systems Architect",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200&fit=facearea&facepad=2"
    }
  ];

  return (
    <section id="about" className="section-container">
      <h2 className="section-title">About RansomGuard</h2>

      {/* Mission */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              Our Mission
            </h3>

            <p className="text-gray-300 mb-4">
              RansomGuard is a student-led cybersecurity initiative focused on
              developing accessible tools to address the growing threat of
              ransomware attacks.
            </p>

            <p className="text-gray-300 mb-6">
              This project was initiated after observing how small businesses
              and educational institutions are increasingly targeted by
              sophisticated ransomware attacks without access to affordable
              protection solutions.
            </p>

            <div className="flex items-center gap-4 bg-white/5 border border-gray-800 rounded-lg p-4">
              <Users className="h-8 w-8 text-ransomguard-purple" />
              <div>
                <p className="font-medium">Student-Led Initiative</p>
                <p className="text-sm text-gray-400">
                  Developed as part of a university cybersecurity project
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-ransomguard-purple/30 to-ransomguard-blue/30 opacity-30 blur-xl rounded-xl"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600&h=400"
                alt="Team collaboration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gradient-to-b from-gray-900 to-ransomguard-dark-bg border border-gray-800 rounded-xl p-8 mb-16">
        <h3 className="text-2xl font-bold mb-2 text-center">
          Our Values
        </h3>
        <p className="text-gray-300 text-center max-w-2xl mx-auto mb-10">
          We believe in building cybersecurity solutions that are ethical,
          effective, and accessible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Innovation",
              description:
                "Continuously improving security approaches to stay ahead of evolving threats",
            },
            {
              title: "Accessibility",
              description:
                "Designing solutions that are practical and affordable for organizations of all sizes",
            },
            {
              title: "Education",
              description:
                "Promoting cybersecurity awareness and hands-on learning",
            },
          ].map((value, index) => (
            <div key={index} className="bg-white/5 p-5 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">
                {value.title}
              </h4>
              <p className="text-gray-300">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">
          Meet Our Team
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-ransomguard-purple/40 transition-all duration-300 group"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 text-center">
                <h4 className="font-medium">{member.name}</h4>
                <p className="text-sm text-gray-400">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
