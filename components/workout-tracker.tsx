"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FitnessTrackingForm } from "@/components/forms/fitness-tracking-form"

export default function WorkoutTracker() {
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Workout</CardTitle>
        <CardDescription>Record your fitness progress</CardDescription>
      </CardHeader>
      <CardContent>
        <FitnessTrackingForm userId={userId} />
      </CardContent>
    </Card>
  )
}
