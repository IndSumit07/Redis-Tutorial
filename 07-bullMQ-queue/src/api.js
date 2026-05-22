import express from "express";
import { emailQueue } from "./queue.js";

const app = express();
app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    return res
      .status(400)
      .json({ error: "Missing required fields: to, subject, body" });
  }
  const job = await emailQueue.add(
    "send-email",
    { to, subject, body },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );
  res.json({ message: "Email job added to the queue", jobId: job.id });
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
