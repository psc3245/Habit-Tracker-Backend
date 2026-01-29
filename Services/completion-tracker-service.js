import * as z from "zod";
import * as userRepo from "../Repositories/user-repo.js";
import * as habitRepo from "../Repositories/habit-repo.js";
import * as completionRepo from "../Repositories/completion-tracker-repo.js";

export const createCompletionSchema = z.object({
  habitId: z.number(),
  userId: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  selectedTag: z.string().optional(),
  value: z.number().optional(),
});

export const updateCompletionSchema = z
  .object({
    selectedTag: z.string().optional(),
    value: z.number().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Need at least one field to update",
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
    date
  );
  if (existingCompletion) {
    return completionRepo.update(existingCompletion.id, {
      selectedTag,
      value,
    });
  }

  const completion = completionRepo.create({
    habitId,
    userId,
    date,
    selectedTag,
    value,
  });

  return completion;
}

export async function findAllCompletions() {
  return completionRepo.findAll();
}

export async function findCompletionById(id) {
  return completionRepo.findById(id);
}

export async function findCompletionsByUserAndDate(userId, date) {
    if (!userId || !date) {
        throw new Error("userId and date required");
    }
    return completionRepo.findByUserAndDate(userId, date);
}

export async function findCompletionsByHabit(habitId) {
    if (!habitId) {
        throw new Error("habitId required");
    }
    return completionRepo.findByHabit(habitId);
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
