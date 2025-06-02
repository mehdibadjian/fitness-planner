"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingDown, TrendingUp, Calendar, Target, Award, Zap } from "lucide-react"

// Temporary user ID - replace with actual user authentication
const TEMP_USER_ID = 1

interface FitnessGoal {
  goal_type: string
  target_value: number
  current_value: number
  start_date: string
  end_date: string
  status: string
}

interface SmokingGoal {
  target_cigarettes_per_day: number
  average_cigarettes: number
  start_date: string
  end_date: string
  status: string
}

interface Craving {
  intensity: number
  trigger?: string
  date: string
  notes?: string
}

interface DashboardStats {
  fitness: {
    goals: FitnessGoal[]
    progress: any[]
  }
  smoking: {
    goals: SmokingGoal[]
    progress: any[]
    cravings: Craving[]
  }
}

export default function ProgressDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    fitness: {
      goals: [],
      progress: [],
    },
    smoking: {
      goals: [],
      progress: [],
      cravings: [],
    },
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Fetch fitness summary
      const fitnessResponse = await fetch(`/api/tracking?type=fitness-summary&userId=${TEMP_USER_ID}`)
      const fitnessData = await fitnessResponse.json()

      // Fetch smoking summary
      const smokingResponse = await fetch(`/api/tracking?type=smoking-summary&userId=${TEMP_USER_ID}`)
      const smokingData = await smokingResponse.json()

      // Fetch cravings
      const cravingsResponse = await fetch(`/api/tracking?type=cravings&userId=${TEMP_USER_ID}`)
      const cravingsData = await cravingsResponse.json()

      setStats({
        fitness: {
          goals: fitnessData || [],
          progress: [],
        },
        smoking: {
          goals: smokingData || [],
          progress: [],
          cravings: cravingsData || [],
        },
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading your progress...</div>
  }

  const latestFitnessGoal = stats.fitness.goals[0]
  const latestSmokingGoal = stats.smoking.goals[0]

  const fitnessProgress = latestFitnessGoal
    ? Math.round((latestFitnessGoal.current_value / latestFitnessGoal.target_value) * 100)
    : 0

  const smokingReduction = latestSmokingGoal
    ? Math.round(
        ((latestSmokingGoal.target_cigarettes_per_day - latestSmokingGoal.average_cigarettes) /
          latestSmokingGoal.target_cigarettes_per_day) *
          100,
      )
    : 0

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fitness Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fitnessProgress}%</div>
            <p className="text-xs text-muted-foreground">
              {latestFitnessGoal ? `${latestFitnessGoal.current_value} of ${latestFitnessGoal.target_value} ${latestFitnessGoal.goal_type}` : "No active goals"}
            </p>
            <Progress value={fitnessProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smoking Reduction</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smokingReduction > 0 ? smokingReduction : 0}%</div>
            <p className="text-xs text-muted-foreground">
              {latestSmokingGoal
                ? `${Math.round(latestSmokingGoal.average_cigarettes)} avg/day (target: ${latestSmokingGoal.target_cigarettes_per_day})`
                : "No active goals"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Craving Intensity</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.smoking.cravings.length > 0
                ? Math.round(
                    stats.smoking.cravings.reduce((acc, curr) => acc + curr.intensity, 0) /
                      stats.smoking.cravings.length,
                  )
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Average craving intensity (1-10)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Tracked</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(
                stats.fitness.progress.length,
                stats.smoking.progress.length,
                stats.smoking.cravings.length,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total days of tracking</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {fitnessProgress >= 80 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Fitness Champion - 80%+ goal progress!</span>
              </div>
            )}
            {smokingReduction >= 25 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <TrendingDown className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Smoke Reducer - 25%+ reduction achieved!</span>
              </div>
            )}
            {stats.smoking.cravings.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium">Craving Warrior - Tracking your triggers!</span>
              </div>
            )}
            {latestSmokingGoal?.average_cigarettes === 0 && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Smoke-Free Hero - Zero cigarettes this week!</span>
              </div>
            )}
            {!fitnessProgress && !smokingReduction && stats.smoking.cravings.length === 0 && (
              <div className="col-span-2 text-center py-4 text-muted-foreground">
                Start tracking your progress to unlock achievements!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
