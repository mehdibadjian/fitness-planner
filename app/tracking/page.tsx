import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Calendar, Heart, Settings } from "lucide-react"
import { Metadata, Viewport } from "next"

// Import client components
import ClientTrackingPage from "@/components/client-tracking-page"

export const metadata: Metadata = {
  title: "Progress Tracking | Fitness Planner",
  description: "Track your fitness and smoking cessation progress",
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

// Server component
export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Progress Tracking</h1>
          <p className="text-xl text-slate-600">Log your daily progress and watch your transformation unfold</p>
        </div>

        <Suspense fallback={<LoadingState />}>
          <ClientTrackingPage />
        </Suspense>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div>
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
          <Card>
            <CardHeader>
              <CardTitle>Loading Dashboard</CardTitle>
              <CardDescription>Please wait while we load your data...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center">
                <div className="animate-pulse text-center">
                  <div className="h-8 w-32 bg-slate-200 rounded mx-auto mb-4"></div>
                  <div className="h-4 w-48 bg-slate-200 rounded mx-auto"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
