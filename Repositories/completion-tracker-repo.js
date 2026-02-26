import pool from '../db/db.js'

export async function create({ habitId, date, selectedTag, value }) {
  const result = await pool.query(
    'INSERT INTO completions (habit_id, date, selected_tag, value) VALUES ($1, $2, $3, $4) RETURNING *',
    [habitId, date, selectedTag, value]
  )
  return result.rows[0]
}

export async function findAll() {
  const result = await pool.query('SELECT * FROM completions')
  return result.rows
}

export async function findById(id) {
  const result = await pool.query('SELECT * FROM completions WHERE completion_id = $1', [id])
  return result.rows[0] ?? null
}

export async function findByHabitAndDate(habitId, date) {
  const result = await pool.query(
    'SELECT * FROM completions WHERE habit_id = $1 AND date = $2',
    [habitId, date]
  )
  return result.rows[0] ?? null
}

export async function findByUserAndDate(userId, date) {
  const result = await pool.query(
    'SELECT c.* FROM completions c JOIN habits h ON c.habit_id = h.habit_id WHERE h.user_id = $1 AND c.date = $2',
    [userId, date]
  )
  return result.rows
}

export async function findByUserId(userId) {
  const result = await pool.query(
    'SELECT c.* FROM completions c JOIN habits h ON c.habit_id = h.habit_id WHERE h.user_id = $1',
    [userId]
  )
  return result.rows
}

export async function findByUserAndDateRange(userId, startDate, endDate) {
  const result = await pool.query(
    'SELECT c.* FROM completions c JOIN habits h ON c.habit_id = h.habit_id WHERE h.user_id = $1 AND c.date >= $2 AND c.date <= $3',
    [userId, startDate, endDate]
  )
  return result.rows
}

export async function findByHabit(habitId) {
  const result = await pool.query('SELECT * FROM completions WHERE habit_id = $1', [habitId])
  return result.rows
}

export async function update(id, updates) {
  const { selectedTag, value } = updates
  const result = await pool.query(
    'UPDATE completions SET selected_tag = $1, value = $2, updated_at = NOW() WHERE completion_id = $3 RETURNING *',
    [selectedTag, value, id]
  )
  return result.rows[0] ?? null
}

export async function remove(id) {
  const result = await pool.query('DELETE FROM completions WHERE completion_id = $1 RETURNING *', [id])
  return result.rows[0] ? true : false
}