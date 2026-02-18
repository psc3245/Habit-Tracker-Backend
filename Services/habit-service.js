import * as z from "zod";
import * as habitRepo from "../Repositories/habit-repo.js";

export const createHabitSchema = z.object({
  userId: z.number(),
  name: z.string(),
  schedule: z.string(), // Daily | Weekly | Monthly | Other ??
  target: z.number(),
  type: z.enum(['checkbox', 'counter', 'duration', 'slider']).default('checkbox'),
  availableTags: z.array(z.string()).default([]),
  createdAt: z.coerce.date().optional(),
});

export const updateHabitSchema = z
  .object({
    userId: z.number().optional(),
    name: z.string().optional(),
    schedule: z.string().optional(),
    target: z.number().optional(),
    availableTags: z.array(z.string()).default([]),
    createdAt: z.coerce.date().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "Need at least one field to update" }
  );

export async function createHabit({
  userId,
  name,
  schedule,
  target,
  type,
  availableTags = [],
  createdAt,
}) {
  if (!userId || !name || !target) {
    throw new Error("Needs userId, name, and target at minimum");
  }

  const res = habitRepo.create({
    userId,
    name,
    schedule,
    target,
    type,
    availableTags,
    createdAt,
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
