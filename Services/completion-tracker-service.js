import * as z from "zod";
import * as userRepo from "../Repositories/user-repo.js";
import * as habitRepo from "../Repositories/habit-repo.js";
import * as completionRepo from "../Repositories/completion-tracker-repo.js";

export const createCompletionSchema = z.object({
  habitId: z.number(),
  userId: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  selectedTag: z.string().optional().nullable(),
  value: z.number().optional().nullable(),
});

export const updateCompletionSchema = z
  .object({
    selectedTag: z.string().optional().nullable(),
    value: z.number().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Need at least one field to update",
  });

export const deleteByHabitAndDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function createCompletion({
  habitId,
  userId,
  date,
  selectedTag,
  value,
}) {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const habit = await habitRepo.findById(habitId);
  if (!habit) {
    throw new Error("Habit not found");
  }

  if (habit.userId !== userId) {
    throw new Error("Habit does not belong to the user");
  }

  const existingCompletion = await completionRepo.findByHabitAndDate(
    habitId,
    date,
  );

  if (existingCompletion) {
    return await completionRepo.update(existingCompletion.id, {
      selectedTag,
      value,
    });
  }

  return await completionRepo.create({
    habitId,
    userId,
    date,
    selectedTag,
    value,
  });
}

export async function findAllCompletions() {
  return await completionRepo.findAll();
}

export async function findCompletionById(id) {
  return await completionRepo.findById(id);
}

export async function findCompletionsByUserAndDate(userId, date) {
  if (!userId || !date) {
    throw new Error("userId and date required");
  }
  return await completionRepo.findByUserAndDate(userId, date);
}

export async function findCompletionsByHabit(habitId) {
  if (!habitId) {
    throw new Error("habitId required");
  }
  return await completionRepo.findByHabit(habitId);
}

export async function findCompletionsByUserAndDateRange(
  userId,
  startDate,
  endDate,
) {
  if (!userId || !startDate || !endDate) throw new Error("Need all parameters");
  return await completionRepo.findByUserAndDateRange(
    userId,
    startDate,
    endDate,
  );
}

export async function findCompletionsByUserId(userId) {
  if (!userId) throw new Error("Needs user id");
  return await completionRepo.findByUserId(userId);
}

export async function updateCompletion(id, updates) {
  if (!updates || Object.keys(updates).length === 0) {
    throw new Error("No updates provided");
  }
  const completion = await completionRepo.update(id, updates);
  if (!completion) {
    throw new Error("Completion not found");
  }
  return completion;
}

export async function deleteCompletion(id) {
  const success = await completionRepo.remove(id);
  return success;
}

export async function deleteCompletionByHabitAndDate(userId, habitId, date) {
  if (!userId || !habitId || !date) {
    throw new Error("userId, habitId, and date required");
  }

  const habit = await habitRepo.findById(habitId);
  if (!habit || habit.userId !== userId) {
    throw new Error("Habit not found or does not belong to user");
  }

  const completion = await completionRepo.findByHabitAndDate(habitId, date);
  if (!completion) {
    return false;
  }

  return await completionRepo.remove(completion.id);
}
