import pool from '../db/db.js'

export async function create(habit) {
  const { userId, name, target, type, availableTags, createdAt, sliderMin, colorLow, colorMid, colorHigh, recurrence } = habit

  const result = await pool.query(
    `INSERT INTO habits (user_id, name, target, type, available_tags, created_at, slider_min, color_low, color_mid, color_high, recurrence_interval, recurrence_days)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [userId, name, target, type, availableTags, createdAt, sliderMin, colorLow, colorMid, colorHigh, recurrence.interval, recurrence.days]
  )
  return result.rows[0]
}

export async function findAll() {
  const result = await pool.query('SELECT * FROM habits')
  return result.rows
}

export async function findById(id) {
  const result = await pool.query('SELECT * FROM habits WHERE habit_id = $1', [id])
  return result.rows[0] ?? null
}

export async function findByUserId(userId) {
  const result = await pool.query('SELECT * FROM habits WHERE user_id = $1', [userId])
  return result.rows
}

export async function update(id, updates) {
  const { name, target, type, availableTags, sliderMin, colorLow, colorMid, colorHigh, recurrence } = updates

  const result = await pool.query(
    `UPDATE habits SET name = $1, target = $2, type = $3, available_tags = $4, slider_min = $5,
     color_low = $6, color_mid = $7, color_high = $8, recurrence_interval = $9, recurrence_days = $10, updated_at = NOW()
     WHERE habit_id = $11 RETURNING *`,
    [name, target, type, availableTags, sliderMin, colorLow, colorMid, colorHigh, recurrence?.interval, recurrence?.days, id]
  )
  return result.rows[0] ?? null
}

export async function remove(id) {
  const result = await pool.query('DELETE FROM habits WHERE habit_id = $1 RETURNING *', [id])
  return result.rows[0] ? true : false
}