import * as z from "zod";
import * as settingsRepo from "../Repositories/settings-repo.js";

export const settingsSchema = z
  .object({
    display_mode: z.enum(["light", "dark"]).optional(),
    left_default_page: z.enum(["profile", "habits"]).optional(),
    right_default_page: z.enum(["profile", "glance", "stats"]).optional(),
    default_habit_type: z
      .enum(["checkbox", "counter", "duration", "slider"])
      .optional(),
  })
  .refine(
    (data) =>
      data.display_mode ||
      data.left_default_page ||
      data.right_default_page ||
      data.default_habit_type,
    {
      message: "Must provide at least one field to update",
    },
  );

export async function getSettingsForUserId(userId) {
  if (!userId) throw new Error("userId required");
  return await settingsRepo.getSettingsForUserId(userId);
}

export async function createSettings(userId) {
  if (!userId) throw new Error("userId required");
  return await settingsRepo.createSettings(userId, {
    display_mode: "light",
    left_default_page: "profile",
    right_default_page: "profile",
    default_habit_type: "checkbox",
  });
}

export async function updateSettings(userId, updates) {
  if (!userId) throw new Error("userId required");
  const data = settingsSchema.parse(updates);
  return await settingsRepo.updateSettings(userId, data);
}
