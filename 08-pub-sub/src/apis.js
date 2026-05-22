import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/notify", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  try {
    await publisher.publish("notifications", message);
    res.json({ success: true, message: "Notification sent!" });
  } catch (err) {
    console.error("Failed to publish message: %s", err.message);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

app.listen(4000, () => {
  console.log("API server is running on http://localhost:4000");
});
