
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "www")));

app.get("/api/status", (req, res) => {
  res.json({
    server: "running",
    apiKeyLoaded: Boolean(process.env.GEMINI_API_KEY)
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const question = req.body?.message;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        reply: "Please enter your question."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        reply: "Gemini API key is missing. Please check your .env file."
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `You are JAI, a helpful Barangay AI Assistant.
Answer in simple English, Cebuano, or Filipino.
Help with barangay services, document requirements,
office hours, and request letters.
Never invent official fees, schedules, or requirements.
Advise users to confirm official details with their Barangay Hall.
Do not request sensitive personal information.`
            }]
          },
          contents: [{
            parts: [{ text: question.trim() }]
          }],
          generationConfig: {
            maxOutputTokens: 700,
            temperature: 0.5
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini HTTP status:", response.status);
      console.error("Gemini error:", data.error || data);

      return res.status(response.status).json({
        reply: `Gemini error (${response.status}): ${
          data.error?.message || "Request failed."
        }`
      });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return res.status(502).json({
        reply: "Gemini did not return a text answer."
      });
    }

    console.log("Gemini response successful.");

    return res.json({ reply });

  } catch (error) {
    console.error("Server error:", error.message);

    return res.status(500).json({
      reply: `Server error: ${error.message}`
    });
  }
});

app.listen(PORT, () => {
  console.log(`JAI is running at http://localhost:${PORT}`);
});
