// Repositories/completion-repo.js

// In-memory storage (replace with DB later)
let completions = [];
let nextId = 1;

export async function create(completionData) {
  const completion = {
    id: nextId++,
    ...completionData,
    completedAt: completionData.completedAt || new Date(),
  };
  completions.push(completion);
  return completion;
}

export async function findAll() {
  return completions;
}

export async function findById(id) {
  return completions.find((c) => c.id === id);
}

export async function findByHabitAndDate(habitId, date) {
  return completions.find((c) => c.habitId === habitId && c.date === date);
}

export function findByUserAndDate(userId, date) {
  console.log("Searching - userId type:", typeof userId, "date type:", typeof date);
  console.log("Searching for exact date string:", date);
  completions.forEach(c => {
    console.log(`  Completion userId: ${c.userId} (${typeof c.userId}), date: ${c.date} (${typeof c.date})`);
    console.log(`  Comparing: "${c.date}" === "${date}"`);
    console.log(`  Match userId? ${c.userId === userId}, Match date? ${c.date === date}`);
  });
  const results = completions.filter((c) => c.userId === userId && c.date === date);
  console.log("Found:", results);
  return results;
}

export async function findByHabit(habitId) {
  return completions.filter((c) => c.habitId === habitId);
}

export async function update(id, updates) {
  const index = completions.findIndex((c) => c.id === id);
  if (index === -1) return null;

  completions[index] = { ...completions[index], ...updates };
  return completions[index];
}

export async function remove(id) {
  const index = completions.findIndex((c) => c.id === id);
  if (index === -1) return false;

  completions.splice(index, 1);
  return true;
}

// Helper for testing/debugging
export function reset() {
  completions = [];
  nextId = 1;
}