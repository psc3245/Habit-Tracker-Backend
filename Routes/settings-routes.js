import { Router } from "express";
import * as settingsController from "../Controllers/settings-controller.js";

const router = Router();

router.get("/:id", settingsController.getSettingsForUserId);
router.post("/:id", settingsController.createSettings);
router.put("/:id", settingsController.updateSettings);

export default router;