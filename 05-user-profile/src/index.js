import express from "express";
import Redis from "ioredis";

const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/user/:id/json", async (req, res) => {
  await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
  res.json({ savedAs: "json" });
});

app.get("/user/:id/json", async (req, res) => {
  const user = await redis.get(`user:${req.params.id}:json`);
  res.json(user ? JSON.parse(user) : null);
});

app.post("/user/:id/hash", async (req, res) => {
  await redis.hset(`user:${req.params.id}:hash`, req.body);
  res.json({ savedAs: "hash" });
});

app.get("/user/:id/hash", async (req, res) => {
  const user = await redis.hgetall(`user:${req.params.id}:hash`);
  res.json(Object.keys(user).length > 0 ? user : null);
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
