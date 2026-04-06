import React from "react";
import {
  DatabaseZap,
  ShieldCheck,
  FileLock,
  FileX,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-ransomguard-purple" />,
      title: "Real-Time Threat Detection",
      description:
        "Monitors suspicious system behavior using safe ransomware indicators to identify potential threats at an early stage.",
    },
    {
      icon: <FileX className="h-10 w-10 text-ransomguard-purple" />,
      title: "Ransomware Pattern Analysis",
      description:
        "Analyzes known ransomware-like patterns and abnormal activity signatures without executing or scanning real malware.",
    },
    {
      icon: <FileLock className="h-10 w-10 text-ransomguard-purple" />,
      title: "AI-Based Behavior Monitoring",
      description:
        "Detects unusual file and process behavior using rule-based and simulated AI logic inspired by enterprise security tools.",
    },
    {
      icon: <DatabaseZap className="h-10 w-10 text-ransomguard-purple" />,
      title: "Automated Recovery Insights",
      description:
        "Provides actionable insights and recovery indicators to help minimize system impact during ransomware incidents.",
    },
  ];

  return (
    // ✅ ID added for navbar scroll
    <section id="features" className="section-container">
      {/* Heading */}
      <h2 className="section-title">Key Features</h2>
      <p className="text-gray-300 text-center max-w-2xl mx-auto mb-16">
        RansomGuard delivers a modern ransomware monitoring experience by
        combining real-time insights, behavioral analysis, and interactive
        security visualization.
      </p>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-gray-900 border-gray-800 hover:border-ransomguard-purple/40 transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-ransomguard-purple/5 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <CardHeader>
              <div className="flex gap-4 items-start">
                <div className="bg-gray-800/50 rounded-lg p-3 group-hover:bg-ransomguard-purple/10 transition-colors">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">
                  {feature.title}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <CardDescription className="text-gray-300 text-base">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Features */}
      <div className="mt-20">
        <div className="bg-gradient-to-b from-gray-900 to-ransomguard-dark-bg border border-gray-800 rounded-xl p-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-3">
              Additional Security Capabilities
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Beyond core ransomware monitoring, RansomGuard includes
              supporting security features to enhance visibility and
              incident awareness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Email Attachment Risk Detection",
              "External Device Activity Monitoring",
              "Network Anomaly Insights",
              "Endpoint Visibility",
              "Security Event Logging",
              "Threat Reporting & Analysis",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-lg"
              >
                <div className="w-8 h-8 bg-ransomguard-purple/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-4 w-4 text-ransomguard-purple" />
                </div>
                <span className="text-gray-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
