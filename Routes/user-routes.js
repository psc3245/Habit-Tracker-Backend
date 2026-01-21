import { Router } from "express";
import * as userController from "../Controllers/user-controller.js";

const router = Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);

router.get("/", userController.findAllUsersOrByUsername);
router.get("/:id", userController.findUserById);


router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

export default router;
