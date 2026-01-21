// repositories/user.repository.js
let users = [];
let nextId = 1;

export function signUp(user) {
  const newUser = {
    id: nextId++,
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

export function login(user) {
  found = users.find(u => u.username === username) ?? null;
  if (found == null) return false;
  if (user.pass == found.pass) return found;
  return false;
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
