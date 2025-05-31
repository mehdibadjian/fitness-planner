"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckCircle, Clock, Zap } from "lucide-react"
import { saveWorkoutEntry, getWorkoutData } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"

interface WorkoutTrackerProps {
  initialData?: any
}

export default function WorkoutTracker({ initialData }: WorkoutTrackerProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [workoutDone, setWorkoutDone] = useState(false)
  const [duration, setDuration] = useState("")
  const [energy, setEnergy] = useState("")
  const [notes, setNotes] = useState("")
  const [weekNumber, setWeekNumber] = useState("1")
  const [isLoading, setIsLoading] = useState(false)

  // Calculate week number based on start date (you can adjust this logic)
  const calculateWeekNumber = (selectedDate: string) => {
    const startDate = new Date("2024-01-01") // Adjust to your program start date
    const currentDate = new Date(selectedDate)
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.ceil(diffDays / 7).toString()
  }

  useEffect(() => {
    setWeekNumber(calculateWeekNumber(date))
    loadExistingData()
  }, [date])

  const loadExistingData = async () => {
    try {
      const existingData = await getWorkoutData(date)
      if (existingData) {
        setWorkoutDone(existingData.workout_done)
        setDuration(existingData.duration?.toString() || "")
        setEnergy(existingData.energy?.toString() || "")
        setNotes(existingData.notes || "")
      } else {
        // Reset form for new date
        setWorkoutDone(false)
        setDuration("")
        setEnergy("")
        setNotes("")
      }
    } catch (error) {
      console.error("Error loading existing data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await saveWorkoutEntry({
        date,
        workout_done: workoutDone,
        duration: duration ? Number.parseInt(duration) : undefined,
        energy: energy ? Number.parseInt(energy) : undefined,
        notes,
        week_number: Number.parseInt(weekNumber),
      })

      if (result.success) {
        toast({
          title: "Workout logged!",
          description: "Your workout has been saved successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save workout",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workout entry",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Daily Workout Tracker
        </CardTitle>
        <CardDescription>Log your daily workout progress</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="week">Week Number</Label>
              <Select value={weekNumber} onValueChange={setWeekNumber}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Week {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="workout-done" checked={workoutDone} onCheckedChange={setWorkoutDone} />
            <Label htmlFor="workout-done" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Workout Completed
            </Label>
          </div>

          {workoutDone && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="30"
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <Label htmlFor="energy" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Energy Level (1-5)
                  </Label>
                  <Select value={energy} onValueChange={setEnergy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select energy level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Very Low</SelectItem>
                      <SelectItem value="2">2 - Low</SelectItem>
                      <SelectItem value="3">3 - Moderate</SelectItem>
                      <SelectItem value="4">4 - High</SelectItem>
                      <SelectItem value="5">5 - Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did the workout feel? Any observations..."
                  rows={3}
                />
              </div>
            </>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save Workout Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
