"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FitnessTrackingForm } from "@/components/forms/fitness-tracking-form"

// Temporary user ID - replace with actual user authentication
const TEMP_USER_ID = 1

export default function WorkoutTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Workout</CardTitle>
        <CardDescription>Record your fitness progress and set new goals</CardDescription>
      </CardHeader>
      <CardContent>
        <FitnessTrackingForm userId={TEMP_USER_ID} />
      </CardContent>
    </Card>
  )
}
