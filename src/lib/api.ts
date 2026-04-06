const BASE_URL = "http://localhost:5000/api";

// 🔐 Simulated ransomware event
export const sendRansomwareEvent = async () => {
  const res = await fetch(`${BASE_URL}/ransomware/detect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filesModified: 1200,
      entropySpike: true
    })
  });
  return res.json();
};

// 🎭 Simulated deepfake detection
export const sendDeepfakeEvent = async () => {
  const res = await fetch(`${BASE_URL}/deepfake/detect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mediaType: "audio",
      probability: 87,
      confidence: "High"
    })
  });
  return res.json();
};

// 🔗 Correlate both attacks
export const correlateThreat = async () => {
  const res = await fetch(`${BASE_URL}/correlate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ransomwareScore: 75,
      deepfakeScore: 87
    })
  });
  return res.json();
};
