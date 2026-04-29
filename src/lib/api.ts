const BASE_URL = "http://localhost:5000/api";

// 🔐 Simulated ransomware event
export const sendRansomwareEvent = async (data: any = {}) => {
  const res = await fetch(`${BASE_URL}/ransomware/detect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.keys(data).length > 0 ? data : {
      filesModified: 1200,
      entropySpike: true,
      threatLevel: "High"
    })
  });
  return res.json();
};

// 🎭 Simulated deepfake detection
export const sendDeepfakeEvent = async (data: any = {}) => {
  const res = await fetch(`${BASE_URL}/deepfake/detect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.keys(data).length > 0 ? data : {
      mediaType: "audio",
      probability: 87,
      confidence: "High"
    })
  });
  return res.json();
};

// 🔗 Correlate both attacks
export const correlateThreat = async (ransomwareScore: number = 75, deepfakeScore: number = 87) => {
  const res = await fetch(`${BASE_URL}/correlate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ransomwareScore,
      deepfakeScore
    })
  });
  return res.json();
};
