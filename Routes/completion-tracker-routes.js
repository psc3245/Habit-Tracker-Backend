import { Router } from "express";
import * as completionController from "../Controllers/completion-tracker-controller.js";

const router = Router();

router.post("/", completionController.createCompletionTracker);

router.get("/all", completionController.findAllCompletions);
router.get("/habit", completionController.findCompletionsByHabit);
router.get("/:id", completionController.findCompletionById);
router.get("/", completionController.findCompletionsByUserAndDate);

router.put("/:id", completionController.updateCompletion);

router.delete("/:id", completionController.deleteCompletion);

export default router;
