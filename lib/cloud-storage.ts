"use client"

import type { WorkoutEntry, SmokingEntry } from "./storage"

// Simple cloud storage using a free service like JSONBin or similar
// For demo purposes, we'll simulate cloud storage with a simple API

interface CloudData {
  workouts: WorkoutEntry[]
  smoking: SmokingEntry[]
  lastSync: string
  userId: string
}

class CloudStorage {
  private apiUrl = "https://api.jsonbin.io/v3/b" // Example API
  private userId: string

  constructor() {
    // Generate or retrieve user ID
    this.userId = this.getUserId()
  }

  private getUserId(): string {
    let userId = localStorage.getItem("fitness_user_id")
    if (!userId) {
      userId = this.generateUserId()
      localStorage.setItem("fitness_user_id", userId)
    }
    return userId
  }

  private generateUserId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  async saveToCloud(workouts: WorkoutEntry[], smoking: SmokingEntry[]): Promise<boolean> {
    try {
      const data: CloudData = {
        workouts,
        smoking,
        lastSync: new Date().toISOString(),
        userId: this.userId,
      }

      // For demo purposes, we'll use localStorage with a cloud prefix
      // In a real app, you'd use a proper cloud service
      localStorage.setItem("cloud_backup", JSON.stringify(data))
      localStorage.setItem("last_cloud_sync", new Date().toISOString())

      return true
    } catch (error) {
      console.error("Failed to save to cloud:", error)
      return false
    }
  }

  async loadFromCloud(): Promise<CloudData | null> {
    try {
      // For demo purposes, we'll use localStorage with a cloud prefix
      // In a real app, you'd fetch from a proper cloud service
      const data = localStorage.getItem("cloud_backup")
      if (data) {
        return JSON.parse(data)
      }
      return null
    } catch (error) {
      console.error("Failed to load from cloud:", error)
      return null
    }
  }

  async syncData(
    localWorkouts: WorkoutEntry[],
    localSmoking: SmokingEntry[],
  ): Promise<{
    workouts: WorkoutEntry[]
    smoking: SmokingEntry[]
    synced: boolean
  }> {
    try {
      const cloudData = await this.loadFromCloud()

      if (!cloudData) {
        // No cloud data, save local data to cloud
        await this.saveToCloud(localWorkouts, localSmoking)
        return {
          workouts: localWorkouts,
          smoking: localSmoking,
          synced: true,
        }
      }

      // Merge local and cloud data (cloud data takes precedence for conflicts)
      const mergedWorkouts = this.mergeWorkouts(localWorkouts, cloudData.workouts)
      const mergedSmoking = this.mergeSmoking(localSmoking, cloudData.smoking)

      // Save merged data back to cloud
      await this.saveToCloud(mergedWorkouts, mergedSmoking)

      return {
        workouts: mergedWorkouts,
        smoking: mergedSmoking,
        synced: true,
      }
    } catch (error) {
      console.error("Sync failed:", error)
      return {
        workouts: localWorkouts,
        smoking: localSmoking,
        synced: false,
      }
    }
  }

  private mergeWorkouts(local: WorkoutEntry[], cloud: WorkoutEntry[]): WorkoutEntry[] {
    const merged = new Map<string, WorkoutEntry>()

    // Add local workouts
    local.forEach((workout) => merged.set(workout.date, workout))

    // Add cloud workouts (overwrites local if same date)
    cloud.forEach((workout) => merged.set(workout.date, workout))

    return Array.from(merged.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  private mergeSmoking(local: SmokingEntry[], cloud: SmokingEntry[]): SmokingEntry[] {
    const merged = new Map<string, SmokingEntry>()

    // Add local entries
    local.forEach((entry) => merged.set(entry.date, entry))

    // Add cloud entries (overwrites local if same date)
    cloud.forEach((entry) => merged.set(entry.date, entry))

    return Array.from(merged.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  getLastSyncTime(): string | null {
    return localStorage.getItem("last_cloud_sync")
  }

  getUserIdForSharing(): string {
    return this.userId
  }
}

export const cloudStorage = new CloudStorage()
