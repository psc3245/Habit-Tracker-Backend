import * as z from "zod";
import * as habitRepo from "../Repositories/habit-repo.js";

export const createHabitSchema = z.object({
  userId: z.number(),
  name: z.string(),
  schedule: z.string(), // Daily | Weekly | Monthly | Other ??
  target: z.number(),
  createdAt: z.coerce.date(),
});

export const updateHabitSchema = z
  .object({
    userId: z.number().optional(),
    name: z.string().optional(),
    schedule: z.string().optional(),
    target: z.number().optional(),
    createdAt: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      !data.userId ||
      !data.name ||
      !data.schedule ||
      !data.target ||
      !data.createdAt,
    {
      message: "Need at least one field to update",
    }
  );

export async function createHabit({
  userId,
  name,
  schedule,
  target,
  createdAt,
}) {
  if (!userId || !name || !target)
    throw new Error("Needs userId, name, and target at minimum");

  let res = habitRepo.create({
    userId,
    name,
    schedule,
    target,
    createdAt,
  });

  if (!res) throw new Error("Uknown repository error");

  return res;
}

export async function findAllHabits() {
  return habitRepo.findAll();
}

export async function findHabitById(id) {
  return habitRepo.findById();
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
