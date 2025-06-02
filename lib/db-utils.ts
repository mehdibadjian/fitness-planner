import db from './db';
import { z } from 'zod';

// Schema definitions
export const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
});

export const FitnessGoalSchema = z.object({
  userId: z.number(),
  goalType: z.string(),
  targetValue: z.number(),
  startDate: z.string(),
  endDate: z.string(),
});

export const FitnessProgressSchema = z.object({
  userId: z.number(),
  goalId: z.number(),
  value: z.number(),
  date: z.string(),
  notes: z.string().optional(),
});

export const SmokingTrackingSchema = z.object({
  userId: z.number(),
  cigarettesPerDay: z.number().min(0),
  date: z.string(),
  notes: z.string().optional(),
});

export const SmokingGoalSchema = z.object({
  userId: z.number(),
  targetCigarettesPerDay: z.number().min(0),
  startDate: z.string(),
  endDate: z.string(),
});

export const CravingTrackingSchema = z.object({
  userId: z.number(),
  intensity: z.number().min(1).max(10),
  trigger: z.string().optional(),
  date: z.string(),
  notes: z.string().optional(),
});

// User operations
export const createUser = (name: string, email?: string) => {
  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  return stmt.run(name, email);
};

export const getUser = (id: number) => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
};

export const createDefaultUser = () => {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO users (id, name, email)
    VALUES (1, 'Default User', 'default@example.com')
  `);
  return stmt.run();
};

// Fitness operations
export const createFitnessGoal = (data: z.infer<typeof FitnessGoalSchema>) => {
  const stmt = db.prepare(`
    INSERT INTO fitness_goals (user_id, goal_type, target_value, start_date, end_date)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(data.userId, data.goalType, data.targetValue, data.startDate, data.endDate);
};

export const recordFitnessProgress = (data: z.infer<typeof FitnessProgressSchema>) => {
  const stmt = db.prepare(`
    INSERT INTO fitness_progress (user_id, goal_id, value, date, notes)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(data.userId, data.goalId, data.value, data.date, data.notes);
};

export const getFitnessProgress = (userId: number, goalId: number) => {
  const stmt = db.prepare(`
    SELECT * FROM fitness_progress 
    WHERE user_id = ? AND goal_id = ?
    ORDER BY date DESC
  `);
  return stmt.all(userId, goalId);
};

// Smoking operations
export const createSmokingGoal = (data: z.infer<typeof SmokingGoalSchema>) => {
  const stmt = db.prepare(`
    INSERT INTO smoking_goals (user_id, target_cigarettes_per_day, start_date, end_date)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(data.userId, data.targetCigarettesPerDay, data.startDate, data.endDate);
};

export const recordSmokingProgress = (data: z.infer<typeof SmokingTrackingSchema>) => {
  const stmt = db.prepare(`
    INSERT INTO smoking_tracking (user_id, cigarettes_per_day, date, notes)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(data.userId, data.cigarettesPerDay, data.date, data.notes);
};

export const recordCraving = (data: z.infer<typeof CravingTrackingSchema>) => {
  const stmt = db.prepare(`
    INSERT INTO cravings_tracking (user_id, intensity, trigger, date, notes)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(data.userId, data.intensity, data.trigger, data.date, data.notes);
};

export const getSmokingProgress = (userId: number) => {
  const stmt = db.prepare(`
    SELECT * FROM smoking_tracking 
    WHERE user_id = ?
    ORDER BY date DESC
  `);
  return stmt.all(userId);
};

export const getCravings = (userId: number) => {
  const stmt = db.prepare(`
    SELECT * FROM cravings_tracking 
    WHERE user_id = ?
    ORDER BY date DESC
  `);
  return stmt.all(userId);
};

// Analytics functions
export const getFitnessProgressSummary = (userId: number) => {
  const stmt = db.prepare(`
    SELECT 
      g.goal_type,
      g.target_value,
      MAX(p.value) as current_value,
      g.start_date,
      g.end_date,
      g.status
    FROM fitness_goals g
    LEFT JOIN fitness_progress p ON g.id = p.goal_id
    WHERE g.user_id = ?
    GROUP BY g.id
  `);
  return stmt.all(userId);
};

export const getSmokingProgressSummary = (userId: number) => {
  const stmt = db.prepare(`
    SELECT 
      g.target_cigarettes_per_day,
      AVG(t.cigarettes_per_day) as average_cigarettes,
      MIN(t.cigarettes_per_day) as lowest_cigarettes,
      g.start_date,
      g.end_date,
      g.status
    FROM smoking_goals g
    LEFT JOIN smoking_tracking t ON g.user_id = t.user_id
    WHERE g.user_id = ?
    GROUP BY g.id
  `);
  return stmt.all(userId);
}; 