import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const DashboardSection = () => {
  const [liveStatus, setLiveStatus] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  /* =========================
     FETCH LIVE STATUS
  ========================= */
  const fetchLiveStatus = async () => {
    const res = await fetch("http://localhost:5000/api/ransomware/live-status");
    const data = await res.json();
    setLiveStatus(data);
  };

  useEffect(() => {
    fetchLiveStatus();
  }, []);

  /* =========================
     BUTTON ACTIONS
  ========================= */
  const simulateThreat = async () => {
    await fetch("http://localhost:5000/api/ransomware/simulate-threat", {
      method: "POST",
    });
    await fetchLiveStatus();
  };

  const clearThreats = async () => {
    await fetch("http://localhost:5000/api/ransomware/clear-threats", {
      method: "POST",
    });
    setAiData(null);
    await fetchLiveStatus();
  };

  const explainThreat = async () => {
    setLoadingAI(true);
    const res = await fetch("http://localhost:5000/api/ransomware/ai-analysis", {
      method: "POST",
    });
    const data = await res.json();
    setAiData(data.aiResponse);
    setLoadingAI(false);
  };

  /* =========================
     AI-DRIVEN VALUES
  ========================= */
  const threats = liveStatus?.threats ?? 0;
  const riskScore = aiData?.riskScore ?? 0;
  const coverage = aiData
    ? Math.max(100 - aiData.riskScore, 30)
    : 90;

  const activityBars = [
    Math.min(20 + riskScore * 0.4, 100),
    Math.min(30 + riskScore * 0.3, 100),
    Math.min(40 + riskScore * 0.5, 100),
    Math.min(25 + riskScore * 0.4, 100),
    Math.min(50 + riskScore * 0.6, 100),
    Math.min(35 + riskScore * 0.4, 100),
    Math.min(20 + riskScore * 0.3, 100),
  ];

  return (
    <section id="dashboard" className="section-container">
      <h2 className="section-title">RansomGuard Dashboard</h2>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={simulateThreat}
          className="px-4 py-2 bg-red-600 rounded"
        >
          🚨 Simulate Threat
        </button>
        <button
          onClick={clearThreats}
          className="px-4 py-2 bg-green-600 rounded"
        >
          ✅ Clear Threats
        </button>
        <button
          onClick={explainThreat}
          className="px-4 py-2 bg-emerald-600 rounded"
        >
          🧠 Explain Threat (AI)
        </button>
      </div>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <p className="text-gray-400 text-sm">Protection Status</p>
          <p
            className={`text-lg font-bold ${
              threats > 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {threats > 0 ? "At Risk" : "Protected"}
          </p>
          <p className="text-sm text-gray-400">Coverage: {coverage}%</p>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <p className="text-gray-400 text-sm">Threats Detected</p>
          <p className="text-lg font-bold">{threats}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <p className="text-gray-400 text-sm">Risk Score</p>
          <p className="text-lg font-bold">{riskScore}/100</p>
        </div>
      </div>

      {/* SECURITY ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded p-4 h-64">
          <h3 className="mb-4">Security Activity</h3>
          <div className="flex items-end justify-around h-40">
            {activityBars.map((h, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-8 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t transition-all duration-700"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-gray-400 mt-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* COVERAGE RING */}
        <div className="bg-gray-800 rounded p-4 h-64">
          <h3 className="mb-4">Protection Coverage</h3>
          <div className="flex justify-center items-center h-48">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-gray-700"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-purple-500"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={
                    251.2 - (coverage / 100) * 251.2
                  }
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">{coverage}%</p>
                <p className="text-xs text-gray-400">Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI EXPLANATION */}
      <div className="bg-gray-800 p-6 rounded mt-8">
        <h3 className="mb-2">🧠 AI Threat Explanation</h3>
        {loadingAI ? (
          <p className="text-yellow-400 animate-pulse">
            Analyzing threat…
          </p>
        ) : aiData ? (
          <>
            <p><b>Threat:</b> {aiData.threatType}</p>
            <p><b>Kill Chain:</b> {aiData.killChainStage}</p>
            <p><b>Risk:</b> {aiData.riskScore}/100</p>
            <p className="mt-2 text-gray-300">{aiData.explanation}</p>
            <p className="mt-2 text-green-400">
              ✅ {aiData.recommendedAction}
            </p>
          </>
        ) : (
          <p className="text-gray-400">
            Click “Explain Threat (AI)” to analyze.
          </p>
        )}
      </div>
    </section>
  );
};

export default DashboardSection;
