import pool from "../db/db.js";

export async function findAll() {
  const result = await pool.query("SELECT * FROM settings");
  return result.rows;
}

export async function getSettingsForUserId(id) {
  const result = await pool.query("SELECT * FROM settings WHERE user_id =$1", [
    id,
  ]);
  return result.rows[0];
}

export async function createSettings(id, settings) {
  const {
    display_mode,
    left_default_page,
    right_default_page,
    default_habit_type,
  } = settings;
  const result = await pool.query(
    "INSERT INTO settings (user_id, display_mode, left_default_page, right_default_page, default_habit_type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      id,
      display_mode,
      left_default_page,
      right_default_page,
      default_habit_type,
    ],
  );
  return result.rows[0];
}

export async function updateSettings(id, updates) {
  const old = await pool.query("SELECT * FROM settings WHERE user_id = $1", [
    id,
  ]);
  const existing = old.rows[0];
  if (!existing) return null;

  const display_mode = updates.display_mode ?? existing.display_mode;
  const left_default_page =
    updates.left_default_page ?? existing.left_default_page;
  const right_default_page =
    updates.right_default_page ?? existing.right_default_page;
  const default_habit_type =
    updates.default_habit_type ?? existing.default_habit_type;

  const result = await pool.query(
    "UPDATE settings SET display_mode = $1, left_default_page = $2, right_default_page = $3, default_habit_type = $4 WHERE user_id = $5 RETURNING *",
    [
      display_mode,
      left_default_page,
      right_default_page,
      default_habit_type,
      id,
    ],
  );
  return result.rows[0] ?? null;
}
