"use server"

import { workoutQueries, smokingQueries, type WorkoutEntry, type SmokingEntry } from "./database"
import { revalidatePath } from "next/cache"

export async function saveWorkoutEntry(data: WorkoutEntry) {
  try {
    workoutQueries.insert.run(
      data.date,
      data.workout_done,
      data.duration || null,
      data.energy || null,
      data.notes || null,
      data.week_number,
    )
    revalidatePath("/tracking")
    return { success: true }
  } catch (error) {
    console.error("Error saving workout:", error)
    return { success: false, error: "Failed to save workout entry" }
  }
}

export async function saveSmokingEntry(data: SmokingEntry) {
  try {
    smokingQueries.insert.run(
      data.date,
      data.cigarettes_smoked,
      data.target,
      data.first_cig_time || null,
      data.craving_intensity || null,
      data.notes || null,
      data.week_number,
    )
    revalidatePath("/tracking")
    return { success: true }
  } catch (error) {
    console.error("Error saving smoking entry:", error)
    return { success: false, error: "Failed to save smoking entry" }
  }
}

export async function getWorkoutData(date?: string, week?: number) {
  try {
    if (date) {
      return workoutQueries.getByDate.get(date)
    } else if (week) {
      return workoutQueries.getByWeek.all(week)
    } else {
      return workoutQueries.getAll.all()
    }
  } catch (error) {
    console.error("Error fetching workout data:", error)
    return null
  }
}

export async function getSmokingData(date?: string, week?: number) {
  try {
    if (date) {
      return smokingQueries.getByDate.get(date)
    } else if (week) {
      return smokingQueries.getByWeek.all(week)
    } else {
      return smokingQueries.getAll.all()
    }
  } catch (error) {
    console.error("Error fetching smoking data:", error)
    return null
  }
}

export async function getWorkoutStats() {
  try {
    return workoutQueries.getStats.get()
  } catch (error) {
    console.error("Error fetching workout stats:", error)
    return null
  }
}

export async function getSmokingStats() {
  try {
    return smokingQueries.getStats.get()
  } catch (error) {
    console.error("Error fetching smoking stats:", error)
    return null
  }
}

export async function getSmokingProgress() {
  try {
    return smokingQueries.getWeeklyProgress.all()
  } catch (error) {
    console.error("Error fetching smoking progress:", error)
    return []
  }
}
