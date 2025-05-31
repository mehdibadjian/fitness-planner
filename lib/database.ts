import Database from "better-sqlite3"
import { join } from "path"

const dbPath = join(process.cwd(), "fitness_tracker.db")
const db = new Database(dbPath)

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    workout_done BOOLEAN NOT NULL,
    duration INTEGER,
    energy INTEGER,
    notes TEXT,
    week_number INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS smoking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    cigarettes_smoked INTEGER NOT NULL,
    target INTEGER NOT NULL,
    first_cig_time TEXT,
    craving_intensity INTEGER,
    notes TEXT,
    week_number INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
  CREATE INDEX IF NOT EXISTS idx_smoking_date ON smoking(date);
`)

export interface WorkoutEntry {
  id?: number
  date: string
  workout_done: boolean
  duration?: number
  energy?: number
  notes?: string
  week_number: number
}

export interface SmokingEntry {
  id?: number
  date: string
  cigarettes_smoked: number
  target: number
  first_cig_time?: string
  craving_intensity?: number
  notes?: string
  week_number: number
}

export const workoutQueries = {
  insert: db.prepare(`
    INSERT OR REPLACE INTO workouts (date, workout_done, duration, energy, notes, week_number)
    VALUES (?, ?, ?, ?, ?, ?)
  `),

  getByDate: db.prepare(`
    SELECT * FROM workouts WHERE date = ?
  `),

  getByWeek: db.prepare(`
    SELECT * FROM workouts WHERE week_number = ? ORDER BY date
  `),

  getAll: db.prepare(`
    SELECT * FROM workouts ORDER BY date DESC
  `),

  getStats: db.prepare(`
    SELECT 
      COUNT(*) as total_workouts,
      SUM(CASE WHEN workout_done = 1 THEN 1 ELSE 0 END) as completed_workouts,
      AVG(CASE WHEN workout_done = 1 THEN duration ELSE NULL END) as avg_duration,
      AVG(CASE WHEN workout_done = 1 THEN energy ELSE NULL END) as avg_energy
    FROM workouts
  `),
}

export const smokingQueries = {
  insert: db.prepare(`
    INSERT OR REPLACE INTO smoking (date, cigarettes_smoked, target, first_cig_time, craving_intensity, notes, week_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  getByDate: db.prepare(`
    SELECT * FROM smoking WHERE date = ?
  `),

  getByWeek: db.prepare(`
    SELECT * FROM smoking WHERE week_number = ? ORDER BY date
  `),

  getAll: db.prepare(`
    SELECT * FROM smoking ORDER BY date DESC
  `),

  getStats: db.prepare(`
    SELECT 
      AVG(cigarettes_smoked) as avg_daily,
      MIN(cigarettes_smoked) as best_day,
      MAX(cigarettes_smoked) as worst_day,
      SUM(cigarettes_smoked) as total_smoked
    FROM smoking
  `),

  getWeeklyProgress: db.prepare(`
    SELECT 
      week_number,
      AVG(cigarettes_smoked) as avg_cigarettes,
      AVG(target) as avg_target
    FROM smoking 
    GROUP BY week_number 
    ORDER BY week_number
  `),
}

export default db
