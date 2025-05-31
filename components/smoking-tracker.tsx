"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Target, Clock } from "lucide-react"
import { saveSmoking, getSmokingByDate, generateId } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

const smokingTargets = [18, 16, 14, 12, 10, 8, 6, 4, 2, 1, 1, 0]

export default function SmokingTracker() {
  const { toast } = useToast()
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [cigarettesSmoked, setCigarettesSmoked] = useState("")
  const [weekNumber, setWeekNumber] = useState("1")
  const [firstCigTime, setFirstCigTime] = useState("")
  const [cravingIntensity, setCravingIntensity] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [entryId, setEntryId] = useState(generateId())

  const currentTarget = smokingTargets[Number.parseInt(weekNumber) - 1] || 0

  const calculateWeekNumber = (selectedDate: string) => {
    const startDate = new Date("2024-01-01")
    const currentDate = new Date(selectedDate)
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.ceil(diffDays / 7).toString()
  }

  useEffect(() => {
    setWeekNumber(calculateWeekNumber(date))
    loadExistingData()
  }, [date])

  const loadExistingData = () => {
    try {
      const existingData = getSmokingByDate(date)
      if (existingData) {
        setEntryId(existingData.id)
        setCigarettesSmoked(existingData.cigarettes_smoked.toString())
        setFirstCigTime(existingData.first_cig_time || "")
        setCravingIntensity(existingData.craving_intensity?.toString() || "")
        setNotes(existingData.notes || "")
      } else {
        setEntryId(generateId())
        setCigarettesSmoked("")
        setFirstCigTime("")
        setCravingIntensity("")
        setNotes("")
      }
    } catch (error) {
      console.error("Error loading existing data:", error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      saveSmoking({
        id: entryId,
        date,
        cigarettes_smoked: Number.parseInt(cigarettesSmoked || "0"),
        target: currentTarget,
        first_cig_time: firstCigTime,
        craving_intensity: cravingIntensity ? Number.parseInt(cravingIntensity) : undefined,
        notes,
        week_number: Number.parseInt(weekNumber),
      })

      const isOnTarget = Number.parseInt(cigarettesSmoked || "0") <= currentTarget
      toast({
        title: isOnTarget ? "Great job!" : "Entry logged",
        description: isOnTarget
          ? "You're meeting your smoking reduction target!"
          : "Keep working toward your goal. Every step counts.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save smoking entry",
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
          <Heart className="h-5 w-5 text-red-600" />
          Daily Smoking Tracker
        </CardTitle>
        <CardDescription>Track your smoking reduction progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="font-medium">
              Week {weekNumber} Target: {currentTarget} cigarettes/day
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="cigarettes">Cigarettes Smoked</Label>
              <Input
                id="cigarettes"
                type="number"
                value={cigarettesSmoked}
                onChange={(e) => setCigarettesSmoked(e.target.value)}
                placeholder="0"
                min="0"
                max="30"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first-cig" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                First Cigarette Time
              </Label>
              <Input
                id="first-cig"
                type="time"
                value={firstCigTime}
                onChange={(e) => setFirstCigTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="craving">Craving Intensity (1-5)</Label>
              <Select value={cravingIntensity} onValueChange={setCravingIntensity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select intensity" />
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
              placeholder="Triggers, strategies used, how you felt..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save Smoking Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
