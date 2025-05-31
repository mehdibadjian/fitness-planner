"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkoutTracker from "@/components/workout-tracker"
import SmokingTracker from "@/components/smoking-tracker"
import ProgressDashboard from "@/components/progress-dashboard"
import SyncStatus from "@/components/sync-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Calendar, Heart, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ClientTrackingPage() {
  const { Toaster } = useToast()

  return (
    <>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="workout" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Workout
          </TabsTrigger>
          <TabsTrigger value="smoking" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Smoking
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Sync
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ProgressDashboard />
        </TabsContent>

        <TabsContent value="workout">
          <div className="max-w-2xl mx-auto">
            <WorkoutTracker />
          </div>
        </TabsContent>

        <TabsContent value="smoking">
          <div className="max-w-2xl mx-auto">
            <SmokingTracker />
          </div>
        </TabsContent>

        <TabsContent value="sync">
          <div className="max-w-2xl mx-auto">
            <SyncStatus />
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Progress History</CardTitle>
              <CardDescription>View your complete journey and historical data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Historical data view coming soon. Your data is being saved and will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </>
  )
}
