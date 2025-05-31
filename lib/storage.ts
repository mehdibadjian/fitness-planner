"use client"

import { getCloudStorage } from "./cloud-storage"

export interface WorkoutEntry {
  id: string
  date: string
  workout_done: boolean
  duration?: number
  energy?: number
  notes?: string
  week_number: number
}

export interface SmokingEntry {
  id: string
  date: string
  cigarettes_smoked: number
  target: number
  first_cig_time?: string
  craving_intensity?: number
  notes?: string
  week_number: number
}

// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Helper function to generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Auto-sync functionality
let syncInProgress = false

async function autoSync() {
  if (!isBrowser || syncInProgress) return

  syncInProgress = true
  try {
    const workouts = getWorkouts()
    const smoking = getSmokingEntries()
    const cloudStorage = getCloudStorage()

    const result = await cloudStorage.syncData(workouts, smoking)

    if (result.synced) {
      // Update local storage with synced data
      localStorage.setItem("workouts", JSON.stringify(result.workouts))
      localStorage.setItem("smoking", JSON.stringify(result.smoking))
    }
  } catch (error) {
    console.error("Auto-sync failed:", error)
  } finally {
    syncInProgress = false
  }
}

// Workout storage functions
export function saveWorkout(workout: WorkoutEntry): void {
  if (!isBrowser) return

  const workouts = getWorkouts()

  // Check if workout with this date already exists
  const existingIndex = workouts.findIndex((w) => w.date === workout.date)

  if (existingIndex >= 0) {
    // Update existing workout
    workouts[existingIndex] = workout
  } else {
    // Add new workout
    workouts.push(workout)
  }

  localStorage.setItem("workouts", JSON.stringify(workouts))

  // Auto-sync after saving
  setTimeout(autoSync, 1000)
}

export function getWorkouts(): WorkoutEntry[] {
  if (!isBrowser) return []

  const data = localStorage.getItem("workouts")
  return data ? JSON.parse(data) : []
}

export function getWorkoutByDate(date: string): WorkoutEntry | undefined {
  if (!isBrowser) return undefined

  const workouts = getWorkouts()
  return workouts.find((workout) => workout.date === date)
}

export function getWorkoutsByWeek(weekNumber: number): WorkoutEntry[] {
  if (!isBrowser) return []

  const workouts = getWorkouts()
  return workouts.filter((workout) => workout.week_number === weekNumber)
}

export function getWorkoutStats() {
  if (!isBrowser) {
    return {
      total_workouts: 0,
      completed_workouts: 0,
      avg_duration: 0,
      avg_energy: 0,
    }
  }

  const workouts = getWorkouts()

  const total_workouts = workouts.length
  const completed_workouts = workouts.filter((w) => w.workout_done).length

  const completedWorkoutsWithDuration = workouts.filter((w) => w.workout_done && w.duration)
  const avg_duration =
    completedWorkoutsWithDuration.length > 0
      ? completedWorkoutsWithDuration.reduce((sum, w) => sum + (w.duration || 0), 0) /
        completedWorkoutsWithDuration.length
      : 0

  const completedWorkoutsWithEnergy = workouts.filter((w) => w.workout_done && w.energy)
  const avg_energy =
    completedWorkoutsWithEnergy.length > 0
      ? completedWorkoutsWithEnergy.reduce((sum, w) => sum + (w.energy || 0), 0) / completedWorkoutsWithEnergy.length
      : 0

  return {
    total_workouts,
    completed_workouts,
    avg_duration,
    avg_energy,
  }
}

// Smoking storage functions
export function saveSmoking(smoking: SmokingEntry): void {
  if (!isBrowser) return

  const smokingEntries = getSmokingEntries()

  // Check if entry with this date already exists
  const existingIndex = smokingEntries.findIndex((s) => s.date === smoking.date)

  if (existingIndex >= 0) {
    // Update existing entry
    smokingEntries[existingIndex] = smoking
  } else {
    // Add new entry
    smokingEntries.push(smoking)
  }

  localStorage.setItem("smoking", JSON.stringify(smokingEntries))

  // Auto-sync after saving
  setTimeout(autoSync, 1000)
}

export function getSmokingEntries(): SmokingEntry[] {
  if (!isBrowser) return []

  const data = localStorage.getItem("smoking")
  return data ? JSON.parse(data) : []
}

export function getSmokingByDate(date: string): SmokingEntry | undefined {
  if (!isBrowser) return undefined

  const smokingEntries = getSmokingEntries()
  return smokingEntries.find((entry) => entry.date === date)
}

export function getSmokingByWeek(weekNumber: number): SmokingEntry[] {
  if (!isBrowser) return []

  const smokingEntries = getSmokingEntries()
  return smokingEntries.filter((entry) => entry.week_number === weekNumber)
}

export function getSmokingStats() {
  if (!isBrowser) {
    return {
      avg_daily: 0,
      best_day: 0,
      worst_day: 0,
      total_smoked: 0,
    }
  }

  const smokingEntries = getSmokingEntries()

  if (smokingEntries.length === 0) {
    return {
      avg_daily: 0,
      best_day: 0,
      worst_day: 0,
      total_smoked: 0,
    }
  }

  const avg_daily = smokingEntries.reduce((sum, entry) => sum + entry.cigarettes_smoked, 0) / smokingEntries.length
  const best_day = Math.min(...smokingEntries.map((entry) => entry.cigarettes_smoked))
  const worst_day = Math.max(...smokingEntries.map((entry) => entry.cigarettes_smoked))
  const total_smoked = smokingEntries.reduce((sum, entry) => sum + entry.cigarettes_smoked, 0)

  return {
    avg_daily,
    best_day,
    worst_day,
    total_smoked,
  }
}

export function getSmokingProgress() {
  if (!isBrowser) return []

  const smokingEntries = getSmokingEntries()

  // Group by week
  const weeklyData: Record<string, { cigarettes: number[]; targets: number[] }> = {}

  smokingEntries.forEach((entry) => {
    const weekKey = entry.week_number.toString()
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { cigarettes: [], targets: [] }
    }

    weeklyData[weekKey].cigarettes.push(entry.cigarettes_smoked)
    weeklyData[weekKey].targets.push(entry.target)
  })

  // Calculate averages
  return Object.entries(weeklyData)
    .map(([week_number, data]) => {
      const avg_cigarettes = data.cigarettes.reduce((sum, val) => sum + val, 0) / data.cigarettes.length
      const avg_target = data.targets.reduce((sum, val) => sum + val, 0) / data.targets.length

      return {
        week_number: Number.parseInt(week_number),
        avg_cigarettes,
        avg_target,
      }
    })
    .sort((a, b) => a.week_number - b.week_number)
}

// Manual sync functions
export async function manualSync(): Promise<boolean> {
  if (!isBrowser) return false

  try {
    const workouts = getWorkouts()
    const smoking = getSmokingEntries()
    const cloudStorage = getCloudStorage()

    const result = await cloudStorage.syncData(workouts, smoking)

    if (result.synced) {
      // Update local storage with synced data
      localStorage.setItem("workouts", JSON.stringify(result.workouts))
      localStorage.setItem("smoking", JSON.stringify(result.smoking))
      return true
    }
    return false
  } catch (error) {
    console.error("Manual sync failed:", error)
    return false
  }
}

export function getLastSyncTime(): string | null {
  if (!isBrowser) return null

  const cloudStorage = getCloudStorage()
  return cloudStorage.getLastSyncTime()
}

export function getUserId(): string {
  if (!isBrowser) return ""

  const cloudStorage = getCloudStorage()
  return cloudStorage.getUserIdForSharing()
}

// Export data functions
export function exportData(): string {
  if (!isBrowser) return "{}"

  const data = {
    workouts: getWorkouts(),
    smoking: getSmokingEntries(),
    exportDate: new Date().toISOString(),
    userId: getUserId(),
  }
  return JSON.stringify(data, null, 2)
}

export function importData(jsonData: string): boolean {
  if (!isBrowser) return false

  try {
    const data = JSON.parse(jsonData)

    if (data.workouts && Array.isArray(data.workouts)) {
      localStorage.setItem("workouts", JSON.stringify(data.workouts))
    }

    if (data.smoking && Array.isArray(data.smoking)) {
      localStorage.setItem("smoking", JSON.stringify(data.smoking))
    }

    // Trigger sync after import
    setTimeout(autoSync, 1000)

    return true
  } catch (error) {
    console.error("Import failed:", error)
    return false
  }
}
