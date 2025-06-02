"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dumbbell, Cigarette } from "lucide-react"
import { useSession } from "next-auth/react"

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
  lowest_cigarettes: number
  start_date: string
  end_date: string
  status: string
}

interface Craving {
  intensity: number
  trigger: string
  date: string
  notes: string
}

interface DashboardStats {
  fitnessGoals: FitnessGoal[]
  smokingGoals: SmokingGoal[]
  cravings: Craving[]
}

export default function ProgressDashboard() {
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id
  const [stats, setStats] = useState<DashboardStats>({
    fitnessGoals: [],
    smokingGoals: [],
    cravings: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!userId) return
      try {
        const [fitnessResponse, smokingResponse, cravingsResponse] = await Promise.all([
          fetch(`/api/tracking?type=fitness-summary&userId=${userId}`),
          fetch(`/api/tracking?type=smoking-summary&userId=${userId}`),
          fetch(`/api/tracking?type=cravings&userId=${userId}`),
        ])

        const fitnessData = await fitnessResponse.json()
        const smokingData = await smokingResponse.json()
        const cravingsData = await cravingsResponse.json()

        setStats({
          fitnessGoals: fitnessData,
          smokingGoals: smokingData,
          cravings: cravingsData,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Fitness Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Dumbbell className="h-5 w-5" />
          Fitness Goals
        </h3>
        {stats.fitnessGoals.map((goal, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm">{goal.goal_type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {goal.current_value} / {goal.target_value}
                  </span>
                </div>
                <Progress
                  value={(goal.current_value / goal.target_value) * 100}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Smoking Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Cigarette className="h-5 w-5" />
          Smoking Goals
        </h3>
        {stats.smokingGoals.map((goal, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm">Cigarettes per Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Average</span>
                  <span>{goal.average_cigarettes.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target</span>
                  <span>{goal.target_cigarettes_per_day}</span>
                </div>
                <Progress
                  value={
                    ((goal.target_cigarettes_per_day - goal.average_cigarettes) /
                      goal.target_cigarettes_per_day) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Cravings */}
      {stats.cravings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Cravings</h3>
          <div className="grid gap-4">
            {stats.cravings.slice(0, 3).map((craving, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Intensity: {craving.intensity}/10
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {craving.trigger && `Trigger: ${craving.trigger}`}
                  </p>
                  {craving.notes && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {craving.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
