"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingDown, TrendingUp, Calendar, Target, Award, Zap } from "lucide-react"
import { getWorkoutStats, getSmokingStats, getSmokingProgress } from "@/lib/storage"

export default function ProgressDashboard() {
  const [stats, setStats] = useState({
    workout: {
      total_workouts: 0,
      completed_workouts: 0,
      avg_duration: 0,
      avg_energy: 0,
    },
    smoking: {
      avg_daily: 0,
      best_day: 0,
      worst_day: 0,
      total_smoked: 0,
    },
    smokingProgress: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      loadStats()
    }
  }, [])

  const loadStats = () => {
    try {
      const workoutStats = getWorkoutStats()
      const smokingStats = getSmokingStats()
      const smokingProgress = getSmokingProgress()

      setStats({
        workout: workoutStats,
        smoking: smokingStats,
        smokingProgress: smokingProgress || [],
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

  const workoutCompletionRate =
    stats.workout?.total_workouts > 0
      ? Math.round((stats.workout.completed_workouts / stats.workout.total_workouts) * 100)
      : 0

  const latestWeekProgress = stats.smokingProgress[stats.smokingProgress.length - 1]
  const smokingReduction =
    stats.smokingProgress.length > 1
      ? Math.round(
          ((stats.smokingProgress[0]?.avg_cigarettes - latestWeekProgress?.avg_cigarettes) /
            stats.smokingProgress[0]?.avg_cigarettes) *
            100,
        )
      : 0

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.workout?.completed_workouts || 0} of {stats.workout?.total_workouts || 0} workouts
            </p>
            <Progress value={workoutCompletionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Workout Duration</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.workout?.avg_duration ? Math.round(stats.workout.avg_duration) : 0}min
            </div>
            <p className="text-xs text-muted-foreground">Target: 25-40 minutes</p>
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
              {latestWeekProgress?.avg_cigarettes ? Math.round(latestWeekProgress.avg_cigarettes) : 0} avg/day this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Level</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.workout?.avg_energy ? stats.workout.avg_energy.toFixed(1) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Average energy rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Weekly Smoking Progress
          </CardTitle>
          <CardDescription>Your journey toward becoming smoke-free</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.smokingProgress.length > 0 ? (
              stats.smokingProgress.map((week: any) => (
                <div key={week.week_number} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={week.avg_cigarettes <= week.avg_target ? "default" : "secondary"}>
                      Week {week.week_number}
                    </Badge>
                    <span className="text-sm">Avg: {Math.round(week.avg_cigarettes)} cigarettes/day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Target: {Math.round(week.avg_target)}</span>
                    {week.avg_cigarettes <= week.avg_target && <Award className="h-4 w-4 text-green-600" />}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No smoking data recorded yet. Start tracking to see your progress!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
            {workoutCompletionRate >= 80 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Consistency Champion - 80%+ workout completion!</span>
              </div>
            )}
            {smokingReduction >= 25 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <TrendingDown className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Smoke Reducer - 25%+ reduction achieved!</span>
              </div>
            )}
            {stats.workout?.avg_energy >= 4 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium">Energy Booster - High energy levels maintained!</span>
              </div>
            )}
            {latestWeekProgress?.avg_cigarettes === 0 && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Smoke-Free Hero - Zero cigarettes this week!</span>
              </div>
            )}
            {!workoutCompletionRate &&
              !smokingReduction &&
              !stats.workout?.avg_energy &&
              !latestWeekProgress?.avg_cigarettes && (
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
