import { de } from "zod/locales";
import pool from "../db/db.js";

export async function findAll() {
  const result = await pool.query("SELECT * FROM settings");
  return result.rows;
}

export async function getSettingsForUserId(id) {
  const result = await pool.query(
    "SELECT * FROM settings WHERE user_id =$1",
    id,
  );
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
    "INSERT INTO settings (user_id, display_mode, left_default_page, right_default_page, default_habit_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [id, display_mode, left_default_page, right_default_page, default_habit_type]
  );
  return result.rows[0];
}
