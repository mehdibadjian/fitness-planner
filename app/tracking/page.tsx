import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkoutTracker from "@/components/workout-tracker"
import SmokingTracker from "@/components/smoking-tracker"
import ProgressDashboard from "@/components/progress-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Calendar, Heart } from "lucide-react"

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Progress Tracking</h1>
          <p className="text-xl text-slate-600">Log your daily progress and watch your transformation unfold</p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
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
      </div>
    </div>
  )
}
