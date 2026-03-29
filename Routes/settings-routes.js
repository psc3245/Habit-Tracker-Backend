import { Router } from "express";
import * as settingsController from "../Controllers/settings-controller.js";

const router = Router();

router.get("/:id", settingsController.getSettingsForUserId);