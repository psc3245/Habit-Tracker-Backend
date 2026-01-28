// repositories/user.repository.js
let users = [];
let nextId = 1;

export function signUp(user) {
  const newUser = {
    id: nextId++,
    habitIds: [],
    ...user,
  };

  users.push(newUser);
  return newUser;
}

export function findAll() {
  return users;
}

export function findById(id) {
  return users.find(u => u.id === id) ?? null;
}

export function findByUsername(username) {
  return users.find(u => u.username === username) ?? null;
}

export function login({ email, username, pass }) {
  let found;

  if (email) {
    found = users.find(u => u.email === email) ?? null;
  } else {
    found = users.find(u => u.username === username) ?? null;
  }

  if (!found) return null;
  return found.pass === pass ? found : null;
}

export function update(id, updates) {
  const user = users.find(u => u.id === id);
  if (!user) return null;

  Object.assign(user, updates);
  return user;
}

export function remove(id) {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;

  users.splice(index, 1);
  return true;
}

/* =========================
   HABIT RELATION HELPERS
   ========================= */

export function addHabitToUser(userId, habitId) {
  const user = findById(userId);
  if (!user) return null;

  if (!user.habitIds) {
    user.habitIds = [];
  }

  user.habitIds.push(habitId);
  return user;
}

export function removeHabitFromUser(userId, habitId) {
  const user = findById(userId);
  if (!user || !user.habitIds) return null;

  user.habitIds = user.habitIds.filter(id => id !== habitId);
  return user;
}
