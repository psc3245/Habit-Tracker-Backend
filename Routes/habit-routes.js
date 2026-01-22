import { Router } from "express";
import * as habitController from "../Controllers/habit-controller.js";

const router = Router();

router.post("/", habitController.createHabit);

router.get("/", habitController.getHabits);


router.put("/:id", habitController.updateHabit);

router.delete("/:id", habitController.removeHabit);

export default router;
