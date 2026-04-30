import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.json({ status: "MERT backend active", version: "0.1.0" });
});

app.listen(port, () => {
  console.log(`MERT backend running on http://localhost:${port}`);
});
