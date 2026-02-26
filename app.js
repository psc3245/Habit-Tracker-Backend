import 'dotenv/config';
import express from "express";
import userRoutes from "./Routes/user-routes.js";
import habitRoutes from "./Routes/habit-routes.js";
import completionRoutes from "./Routes/completion-tracker-routes.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://habit-tracker-psc3245.vercel.app"
  ]
}));

app.use(express.json());

app.use("/users", userRoutes);

app.use("/habits", habitRoutes);

app.use("/completions", completionRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
