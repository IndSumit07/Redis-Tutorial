import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    return res
      .status(400)
      .json({ error: "Missing required fields: to, subject, body" });
  }
  const email = { to, subject, body };
  await redis.lpush(QUEUE_KEY, JSON.stringify(email));
  res.json({ status: "queued" });
});

app.get("/emails/process-one", async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);
  if (!rawJob) {
    return res.status(404).json({ error: "No emails in queue" });
  }
  res.json(JSON.parse(rawJob));
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
