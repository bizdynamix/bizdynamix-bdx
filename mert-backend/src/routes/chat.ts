import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  const { message } = req.body;

  return res.json({
    answer: "This is a starter AI chatbot backend response. Replace this stub with your own model, embeddings, or external AI service.",
    received: message
  });
});

export default router;
