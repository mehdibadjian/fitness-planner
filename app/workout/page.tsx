import WorkoutTracker from "@/components/workout-tracker"

export default function WorkoutPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Workout Tracker</h1>
      <WorkoutTracker />
    </div>
  )
} 