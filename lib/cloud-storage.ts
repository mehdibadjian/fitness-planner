"use client"

import type { WorkoutEntry, SmokingEntry } from "./storage"

interface CloudData {
  workouts: WorkoutEntry[]
  smoking: SmokingEntry[]
  lastSync: string
  userId: string
}

class CloudStorage {
  private userId = ""
  private isClient = false

  constructor() {
    // Check if we're in a browser environment
    this.isClient = typeof window !== "undefined"

    // Only initialize if we're in the browser
    if (this.isClient) {
      this.userId = this.getUserId()
    }
  }

  private getUserId(): string {
    if (!this.isClient) return ""

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
    if (!this.isClient) return false

    try {
      const data: CloudData = {
        workouts,
        smoking,
        lastSync: new Date().toISOString(),
        userId: this.userId,
      }

      localStorage.setItem("cloud_backup", JSON.stringify(data))
      localStorage.setItem("last_cloud_sync", new Date().toISOString())

      return true
    } catch (error) {
      console.error("Failed to save to cloud:", error)
      return false
    }
  }

  async loadFromCloud(): Promise<CloudData | null> {
    if (!this.isClient) return null

    try {
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
    if (!this.isClient) {
      return {
        workouts: localWorkouts,
        smoking: localSmoking,
        synced: false,
      }
    }

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
    if (!this.isClient) return null
    return localStorage.getItem("last_cloud_sync")
  }

  getUserIdForSharing(): string {
    if (!this.isClient) return ""
    return this.userId
  }
}

// Use lazy initialization to prevent server-side execution
let cloudStorageInstance: CloudStorage | null = null

export function getCloudStorage(): CloudStorage {
  if (typeof window !== "undefined" && !cloudStorageInstance) {
    cloudStorageInstance = new CloudStorage()
  }

  // Return a dummy instance for server-side rendering
  return cloudStorageInstance || new CloudStorage()
}
