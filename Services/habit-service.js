import * as z from "zod";
import * as habitRepo from "../Repositories/habit-repo.js";

export const createHabitSchema = z.object({
});

export const findHabitSchema = z.object({
});

export const updateHabitSchema = z.object({

});

export async function createHabit() {
}

export async function findAllHabits() {
}

export async function findHabitById(id) {
}

export async function updateHabit(id, updates) {
}

export async function deleteHabit(id) {
}