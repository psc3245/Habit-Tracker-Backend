// repositories/user.repository.js
let habits = [];
let nextId = 1;

export function create(habit) {
  const newHabit = {
    id: nextId++,
    ...habit,
  };

  habits.push(newHabit);
  return newHabit;
}

export function findAll() {
  return habits;
}

export function findById(id) {
  return habits.find(h => h.id === id) ?? null;
}

export function update(id, updates) {
  const habit = habits.find(h => h.id === id);
  if (!habit) return null;

  Object.assign(habit, updates);
  return habit;
}

export function remove(id) {
  const index = habits.findIndex(h => h.id === id);
  if (index === -1) return false;

  habits.splice(index, 1);
  return true;
}
