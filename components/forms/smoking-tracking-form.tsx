import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

const smokingTrackingSchema = z.object({
  targetCigarettesPerDay: z.number().min(0, "Target must be positive"),
  cigarettesPerDay: z.number().min(0, "Current count must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  cravingIntensity: z.number().min(1).max(10).optional(),
  trigger: z.string().optional(),
  notes: z.string().optional(),
});

type SmokingTrackingFormValues = z.infer<typeof smokingTrackingSchema>;

interface SmokingTrackingFormProps {
  userId: number;
  onSuccess?: () => void;
}

export function SmokingTrackingForm({ userId, onSuccess }: SmokingTrackingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SmokingTrackingFormValues>({
    resolver: zodResolver(smokingTrackingSchema),
    defaultValues: {
      targetCigarettesPerDay: 0,
      cigarettesPerDay: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      cravingIntensity: 5,
      trigger: "",
      notes: "",
    },
  });

  async function onSubmit(data: SmokingTrackingFormValues) {
    try {
      setIsSubmitting(true);

      // First create the smoking goal
      const goalResponse = await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "smoking-goal",
          data: {
            userId,
            targetCigarettesPerDay: data.targetCigarettesPerDay,
            startDate: data.startDate,
            endDate: data.endDate,
          },
        }),
      });

      if (!goalResponse.ok) {
        throw new Error("Failed to create smoking goal");
      }

      // Record smoking progress
      const progressResponse = await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "smoking-progress",
          data: {
            userId,
            cigarettesPerDay: data.cigarettesPerDay,
            date: new Date().toISOString().split("T")[0],
            notes: data.notes,
          },
        }),
      });

      if (!progressResponse.ok) {
        throw new Error("Failed to record smoking progress");
      }

      // If there's a craving, record it
      if (data.cravingIntensity) {
        const cravingResponse = await fetch("/api/tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "craving",
            data: {
              userId,
              intensity: data.cravingIntensity,
              trigger: data.trigger,
              date: new Date().toISOString(),
              notes: data.notes,
            },
          }),
        });

        if (!cravingResponse.ok) {
          throw new Error("Failed to record craving");
        }
      }

      toast.success("Smoking progress recorded successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to record smoking progress");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="targetCigarettesPerDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Cigarettes/Day</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 5"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cigarettesPerDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Cigarettes/Day</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 10"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="cravingIntensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Craving Intensity (1-10)</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[field.value ?? 5]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trigger"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trigger (if any)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., After lunch, Stress" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Recording..." : "Record Progress"}
        </Button>
      </form>
    </Form>
  );
} 