import * as habitService from "../Services/habit-service.js";

export async function createHabit(req, res) {
  try {
    const data = habitService.createHabitSchema.parse(req.body);
    const habit = await habitService.createHabit(data);
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getHabits(req, res) {
  try {
    const habits = await habitService.findAllHabits();
    res.status(200).json(habits);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateHabit(req, res) {
  try {
    const { id } = req.params;
    const data = habitService.updateHabitSchema.parse(req.body);
    const updated = await habitService.updateHabit(id, data);
    if (!updated) {
      return res.status(404).json({ error: "Habit not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function removeHabit(req, res) {
  try {
    const { id } = req.params;
    const deleted = await habitService.deleteHabit(id);
    if (!deleted) {
      return res.status(404).json({ error: "Habit not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}