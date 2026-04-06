const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ransomguard')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use("/api/ransomware", require("./routes/ransomware.routes.cjs"));
app.use("/api/deepfake", require("./routes/deepfake.routes.cjs"));
app.use("/api/correlate", require("./routes/correlate.routes.cjs"));
app.use("/api/auth", require("./routes/auth.routes.cjs"));
app.use("/api/contact", require("./routes/contact.routes.cjs"));

app.get("/", (req, res) => {
  res.send("RansomGuard Backend is running");
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
