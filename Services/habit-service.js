import * as z from "zod";
import * as habitRepo from "../Repositories/habit-repo.js";

export const createHabitSchema = z.object({
  userId: z.number(),
  name: z.string(),
  target: z.number(),
  type: z
    .enum(["checkbox", "counter", "duration", "slider"])
    .default("checkbox"),
  availableTags: z.array(z.string()).default([]),
  createdAt: z.coerce.date().optional(),
  sliderMin: z.number().optional().nullable(),
  colorLow: z.string().optional().nullable(),
  colorMid: z.string().optional().nullable(),
  colorHigh: z.string().optional().nullable(),
  recurrence: z.object({
    interval: z.number().int().min(1),
    days: z
      .array(z.number().int().min(0).max(6))
      .nonempty()
      .max(7)
      .refine((days) => new Set(days).size === days.length),
  }).default(
    {
      interval: 1,
      days: [0, 1, 2, 3, 4, 5, 6],
    }
  ),
});

export const updateHabitSchema = z
  .object({
    userId: z.number().optional(),
    name: z.string().optional(),
    type: z.enum(["checkbox", "counter", "duration", "slider"]).optional(),
    target: z.number().optional(),
    availableTags: z.array(z.string()).optional(),
    sliderMin: z.number().optional().nullable(),
    colorLow: z.string().optional().nullable(),
    colorMid: z.string().optional().nullable(),
    colorHigh: z.string().optional().nullable(),
    recurrence: z
      .object({
        interval: z.number().int().min(1),
        days: z
          .array(z.number().int().min(0).max(6))
          .nonempty()
          .max(7)
          .refine((days) => new Set(days).size === days.length),
      })
      .optional()
      .nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Need at least one field to update",
  });

export async function createHabit({
  userId,
  name,
  target,
  type,
  availableTags = [],
  createdAt,
  sliderMin,
  colorLow,
  colorMid,
  colorHigh,
  recurrence,
}) {
  if (!userId || !name || !target) {
    throw new Error("Needs userId, name, and target at minimum");
  }

  const res = habitRepo.create({
    userId,
    name,
    target,
    type,
    availableTags,
    createdAt,
    sliderMin,
    colorLow,
    colorMid,
    colorHigh,
    recurrence,
  });

  if (!res) throw new Error("Unknown repository error");

  return res;
}

export async function findAllHabits() {
  return habitRepo.findAll();
}

export async function findHabitById(id) {
  return habitRepo.findById(id);
}

export async function updateHabit(id, updates) {
  if (!id) {
    throw new Error("id required");
  }

  return habitRepo.update(id, updates);
}

export async function deleteHabit(id) {
  if (!id) {
    throw new Error("id required");
  }

  return habitRepo.remove(id);
}
