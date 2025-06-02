"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SmokingTrackingForm } from "@/components/forms/smoking-tracking-form"

export default function SmokingTracker() {
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Smoking</CardTitle>
        <CardDescription>Record your smoking progress and cravings</CardDescription>
      </CardHeader>
      <CardContent>
        <SmokingTrackingForm userId={userId} />
      </CardContent>
    </Card>
  )
}
