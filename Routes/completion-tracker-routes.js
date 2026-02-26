import { Router } from "express";
import * as completionController from "../Controllers/completion-tracker-controller.js";

const router = Router();

router.post("/", completionController.createCompletionTracker);

router.get("/all", completionController.findAllCompletions);
router.get("/habit", completionController.findCompletionsByHabit);
router.get("/range", completionController.findCompletionsByUserAndDateRange);
router.get("/user", completionController.findCompletionsForUser);
router.get("/", completionController.findCompletionsByUserAndDate);
router.get("/:id", completionController.findCompletionById);

router.put("/:id", completionController.updateCompletion);

router.delete("/:id", completionController.deleteCompletion);
router.delete("/:userId/:habitId", completionController.deleteCompletionByHabitAndDate);

export default router;
