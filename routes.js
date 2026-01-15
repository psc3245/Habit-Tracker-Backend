import { Router } from "express";
import { createUserController } from "../controllers/user.controller.js";

const router = Router();

router.post("/", createUserController);

router.get("/", () => {});
router.get("/:id", () => {});

router.put("/:id", () => {});

router.delete("/:id", () => {});

export default router;
