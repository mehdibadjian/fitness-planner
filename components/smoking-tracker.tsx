"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SmokingTrackingForm } from "@/components/forms/smoking-tracking-form"

// Temporary user ID - replace with actual user authentication
const TEMP_USER_ID = 1

export default function SmokingTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Smoking</CardTitle>
        <CardDescription>Record your smoking progress and cravings</CardDescription>
      </CardHeader>
      <CardContent>
        <SmokingTrackingForm userId={TEMP_USER_ID} />
      </CardContent>
    </Card>
  )
}
