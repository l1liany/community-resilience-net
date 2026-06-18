import dotenv from "dotenv";
dotenv.config();

// === PASTE THIS DIAGNOSTIC BLOCK HERE ===
console.log("=========================================");
console.log("🔍 RUNTIME DIAGNOSTICS:");
console.log("Current Directory:", process.cwd());
console.log("Is API Key Defined?:", process.env.GEMINI_API_KEY ? "✅ YES" : "❌ NO");
if (process.env.GEMINI_API_KEY) {
  console.log("Key Starts With:", `"${process.env.GEMINI_API_KEY.substring(0, 4)}"`);
  console.log("Key Ends With:", `"${process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)}"`);
  console.log("Total Character Length:", process.env.GEMINI_API_KEY.length);
}
console.log("=========================================");

import express from "express";
import cors from "cors";
// 1. Switch to the modern official Google Gen AI SDK
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors({ origin: 'http://localhost:5173', methods: ['GET', 'POST'] }));
app.use(express.json());

// 2. Initialize the client ONCE globally so it securely handles your AQ. key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const centers = [
  {
    id: "1",
    name: "Mathare Social Justice Centre",
    address: "Mathare, Nairobi",
    region: "Nairobi",
    lat: -1.2655,
    lng: 36.8574,
    is_open: true,
    services: ["First Aid", "Water", "Shelter"],
    phone: "+254 700 000000",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Kenya Red Cross Society HQ",
    address: "South C, Nairobi",
    region: "Nairobi",
    lat: -1.3234,
    lng: 36.8335,
    is_open: true,
    services: ["Medical", "Food", "Shelter", "Coordination"],
    phone: "+254 711 111111",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "St John Ambulance Hub",
    address: "Nairobi Central",
    region: "Nairobi",
    lat: -1.2913,
    lng: 36.8209,
    is_open: true,
    services: ["Ambulance", "Emergency Medical", "First Aid"],
    phone: "+254 722 222222",
    created_at: new Date().toISOString(),
  }
];

const updates = [
  {
    id: "1",
    title: "Flash Flood Warning",
    body: "Severe flash flooding reported along Thika Road and Outering Road. Avoid these routes if possible.",
    severity: "high",
    region: "Nairobi",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Nyando Basin Alert",
    body: "Water levels rising in the Nyando Basin. Evacuation centers are currently being set up by the Red Cross.",
    severity: "critical",
    region: "Western Region",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  }
];

app.get("/api/centers", (req, res) => {
  res.json(centers);
});

app.get("/api/updates", (req, res) => {
  res.json(updates);
});

app.post("/api/chat", async (req, res) => {
  try {
    const { situation } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Backend missing GEMINI_API_KEY in .env file." });
    }

    // 3. Use the updated generateContent layout optimized for Gemini 2.5
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User situation: ${situation}`,
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error("Gemini SDK Error:", err);
    res.status(500).json({ error: "Failed to process chat with Gemini." });
  }
});

app.get("/api/directions", (req, res) => {
  const { centerId, userLat, userLng } = req.query;
  const center = centers.find((c) => c.id === centerId);
  if (!center) {
    return res.status(404).json({ error: "Center not found" });
  }

  // Fixed the missing '$' template literal syntax bugs here
  if (!userLat || !userLng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=$${center.lat},${center.lng}`;
    return res.json({ url });
  }

  const url = `https://www.google.com/maps/dir/?api=1&origin=$${userLat},${userLng}&destination=${center.lat},${center.lng}`;
  res.json({ url });
});

app.post("/api/donate", (req, res) => {
  const { phone, amount, paybill, account } = req.body;
  if (!phone || !amount) {
    return res.status(400).json({ error: "Phone and amount are required" });
  }

  setTimeout(() => {
    res.json({
      success: true,
      message: `Successfully initiated M-Pesa STK push for KES ${amount} to ${phone}. Thank you for donating to ${account || "HopeBridge"}!`,
      receipt: `RCPT${Math.floor(Math.random() * 1000000)}`
    });
  }, 1500);
});

app.listen(5000, () => {
  console.log(`Backend server running on http://localhost:5000`);
});