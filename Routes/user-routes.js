import { Router } from "express";
import * as userController from "../Controllers/user-controller.js";

const router = Router();

router.post("/", userController.create);

router.get("/", userController.findAllOrByUsername);
router.get("/:id", userController.findById);


router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

export default router;
