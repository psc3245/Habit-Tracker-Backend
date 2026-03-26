import pool from '../db/db.js'

export async function signUp(user) {
  const { username, email, password, dateOfBirth, firstName, lastName } = user
  const result = await pool.query(
    'INSERT INTO users (username, email, password, date_of_birth, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [username, email, password, dateOfBirth, firstName, lastName]
  )
  return result.rows[0]
}

export async function findAll() {
  const result = await pool.query('SELECT * FROM users')
  return result.rows
}

export async function findById(id) {
  const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id])
  return result.rows[0] ?? null
}

export async function findByUsername(username) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
  return result.rows[0] ?? null
}

export async function findByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  return result.rows[0] ?? null
}

export async function update(id, updates) {
  const old = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
  const existing = old.rows[0];
  if (!existing) return null;

  const username = updates.username ?? existing.username;
  const email = updates.email ?? existing.email;
  const password = updates.password ?? existing.password;
  const dateOfBirth = updates.dateOfBirth ?? existing.date_of_birth;
  const firstName = updates.firstName ?? existing.first_name;
  const lastName = updates.lastName ?? existing.last_name;

  const result = await pool.query(
    'UPDATE users SET username = $1, email = $2, password = $3, date_of_birth = $4, first_name = $5, last_name = $6, updated_at = NOW() WHERE user_id = $7 RETURNING *',
    [username, email, password, dateOfBirth, firstName, lastName, id]
  )
  return result.rows[0] ?? null;
}

export async function remove(id) {
  const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id])
  return result.rows[0] ? true : false
}