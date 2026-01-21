import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateRecapWithGroq } from "./groq";

dotenv.config();
console.log("GROQ KEY PRESENT:", !!process.env.GROQ_API_KEY);


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Recap AI Server is running 🚀");
});

app.post("/api/generate", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 5) {
      return res.status(400).json({ error: "Text is too short" });
    }

    const recap = await generateRecapWithGroq(text);
    res.json(recap);
  } catch (error: any) {
  console.error("FULL ERROR:", error);
  res.status(500).json({
    error: "Failed to generate recap",
    details: error?.message || error
  });
}

});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
