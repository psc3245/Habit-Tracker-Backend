-- Additive, backward-compatible schema changes:
-- 1. completions.text_value — free-text completion value (used by checknote/shorttext/journal habit types)
-- 2. habits.archived — pause/archive a habit without deleting its history

ALTER TABLE completions ADD COLUMN IF NOT EXISTS text_value TEXT;

ALTER TABLE habits ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT false;
