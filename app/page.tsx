import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock, Target, TrendingUp, Heart, Zap, CheckCircle, Users } from "lucide-react"

export default function FitnessPlan() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">💪 Fitness Comeback</h1>
            <div className="hidden md:flex space-x-6">
              <a href="#overview" className="text-slate-600 hover:text-slate-800 transition-colors">
                Overview
              </a>
              <a href="#phases" className="text-slate-600 hover:text-slate-800 transition-colors">
                Training Phases
              </a>
              <a href="#smoking" className="text-slate-600 hover:text-slate-800 transition-colors">
                Smoking Plan
              </a>
              <a href="/tracking" className="text-slate-600 hover:text-slate-800 transition-colors">
                Tracking
              </a>
              <a href="#recovery" className="text-slate-600 hover:text-slate-800 transition-colors">
                Recovery
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">12-Week Transformation</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Bodyweight Fitness & <br />
            <span className="text-green-600">Lifestyle Comeback</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            A comprehensive plan designed for busy professionals to reclaim their fitness and break free from smoking.
            No equipment needed, just 25-40 minutes per day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <a href="/tracking">Start Tracking Progress</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#phases">View Training Phases</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Profile & Overview */}
      <section id="overview" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Program Overview</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Age:</span>
                  <span className="font-medium">38 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Height/Weight:</span>
                  <span className="font-medium">183 cm / 71 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Experience:</span>
                  <span className="font-medium">Bodyweight & hiking background</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Current Challenge:</span>
                  <span className="font-medium">1 pack/day, 6hrs sleep</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Available Time:</span>
                  <span className="font-medium">Early mornings (before 6 AM)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Program Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>No equipment needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>25-40 minutes per day maximum</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>6 days per week training</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Morning-optimized workouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Integrated smoking cessation plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Weekly progress tracking</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Training Phases */}
      <section id="phases" className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">3-Phase Training System</h2>

          <Tabs defaultValue="phase1" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="phase1">Phase 1: Foundation</TabsTrigger>
              <TabsTrigger value="phase2">Phase 2: Build</TabsTrigger>
              <TabsTrigger value="phase3">Phase 3: Peak</TabsTrigger>
            </TabsList>

            <TabsContent value="phase1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Phase 1: Reset & Foundation (Weeks 1-4)
                  </CardTitle>
                  <CardDescription>
                    Build back functional mobility, aerobic base, and re-establish habits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Weekly Schedule</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Focus</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Monday</TableCell>
                            <TableCell>Full Body Basics</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Tuesday</TableCell>
                            <TableCell>Cardio + Mobility</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Wednesday</TableCell>
                            <TableCell>Strength Foundation</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Thursday</TableCell>
                            <TableCell>Rest / Walk</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Friday</TableCell>
                            <TableCell>Circuit Training</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Saturday</TableCell>
                            <TableCell>Hike / Long Walk</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Sunday</TableCell>
                            <TableCell>Breathing + Stretch</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Sample Foundation Workout (30-35 mins)</h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-green-600">Warm-up (5 min)</h5>
                          <p className="text-sm text-slate-600">Arm circles, leg swings, deep squat hold</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-green-600">Main (3 rounds)</h5>
                          <ul className="text-sm text-slate-600 space-y-1">
                            <li>• Air Squats x 15</li>
                            <li>• Incline Push-ups x 10</li>
                            <li>• Glute Bridges x 15</li>
                            <li>• Plank Shoulder Taps x 10/side</li>
                            <li>• Wall Sit x 30 sec</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-green-600">Cooldown</h5>
                          <p className="text-sm text-slate-600">Forward fold, hamstrings, breathing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phase2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    Phase 2: Build & Condition (Weeks 5-8)
                  </CardTitle>
                  <CardDescription>Boost strength, increase intensity, develop consistency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Training Focus</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>EMOM/AMRAP style workouts</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Higher tempo and short rest periods</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Push-up and leg strength progressions</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Example EMOM Workout</h4>
                      <div className="bg-slate-100 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Every Minute on the Minute:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Minute 1 – 10 Push-ups</li>
                          <li>• Minute 2 – 15 Jump Squats</li>
                          <li>• Minute 3 – 30-sec Plank</li>
                        </ul>
                        <p className="text-sm mt-2 text-slate-600">Repeat for 4 rounds (12 minutes)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phase3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-600" />
                    Phase 3: Peak & Challenge (Weeks 9-12)
                  </CardTitle>
                  <CardDescription>Push toward pre-peak fitness capacity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Full Body HIIT</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Burpees</li>
                        <li>• Mountain climbers</li>
                        <li>• V-ups</li>
                        <li>• High-intensity intervals</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Advanced Push-ups</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Decline push-ups</li>
                        <li>• Close-grip variations</li>
                        <li>• Single-arm progressions</li>
                        <li>• Explosive movements</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Power & Agility</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Jump squats</li>
                        <li>• Plyometric lunges</li>
                        <li>• Tempo variations</li>
                        <li>• Complex movements</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Smoking Reduction Plan */}
      <section id="smoking" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">🚭 12-Week Smoking Taper Plan</h2>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Progressive Reduction Strategy</CardTitle>
              <CardDescription>
                Gradual reduction approach to minimize withdrawal while building new habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week</TableHead>
                    <TableHead>Max Cigarettes/day</TableHead>
                    <TableHead>Goal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">1</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell>Track every cigarette</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2</TableCell>
                    <TableCell>16</TableCell>
                    <TableCell>Delay first by 30 minutes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3</TableCell>
                    <TableCell>14</TableCell>
                    <TableCell>Replace 2 smokes with walks</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>Add herbal tea for cravings</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">5</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>Begin smoke-free mornings</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">6</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>Breathing exercises daily</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">7</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>Try 1 full smoke-free day</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">8</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>Journal cravings</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">9</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>Only for extreme stress</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">10</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Test 2-3 full smoke-free days</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">11</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Optional only</TableCell>
                  </TableRow>
                  <TableRow className="bg-green-50">
                    <TableCell className="font-medium">12</TableCell>
                    <TableCell className="text-green-600 font-bold">0</TableCell>
                    <TableCell className="text-green-600 font-bold">
                      Fully smoke-free, new identity starts here 🚭
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tracking Templates */}
      <section id="tracking" className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">📝 Weekly Tracking Templates</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Workout Tracker
                </CardTitle>
                <CardDescription>Track your daily workouts and energy levels</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Done?</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Energy (1-5)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <TableRow key={day}>
                        <TableCell className="font-medium">{day}</TableCell>
                        <TableCell>Y/N</TableCell>
                        <TableCell>___ min</TableCell>
                        <TableCell>___</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Smoking Tracker
                </CardTitle>
                <CardDescription>Monitor your smoking reduction progress</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Smoked</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>First Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <TableRow key={day}>
                        <TableCell className="font-medium">{day}</TableCell>
                        <TableCell>___</TableCell>
                        <TableCell>___</TableCell>
                        <TableCell>___</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recovery Section */}
      <section id="recovery" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">🧘 Recovery, Sleep & Breathing Habits</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Sleep Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Nudge toward 6.5–7 hours. Start with 15-minute earlier bedtime each week.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5 text-blue-600" />
                  Daily Breathing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  3 sets of 1-minute deep diaphragmatic breathing exercises daily.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-green-600" />
                  Weekly Stretch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Focus areas: Hamstrings, hips, and shoulders. 10-15 minutes daily.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-cyan-600" />
                  Cold Therapy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Cold water rinse post-workout for alertness and mood boost.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-800 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Comeback?</h3>
          <p className="text-slate-300 mb-6">
            Your journey to reclaiming your fitness and breaking free from smoking starts now.
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Download Complete Plan
          </Button>
          <div className="mt-8 pt-8 border-t border-slate-700">
            <p className="text-slate-400 text-sm">
              © 2024 Fitness Comeback Plan. Designed for sustainable lifestyle transformation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
