import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Cigarette } from "lucide-react"
import Link from "next/link"
import ProgressDashboard from "@/components/progress-dashboard"

export default function Home() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Fitness Planner</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <Link href="/workout">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workout</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Track your fitness goals</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/smoking">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Smoking</CardTitle>
              <Cigarette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Monitor smoking habits</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressDashboard />
        </CardContent>
      </Card>
    </div>
  )
}
