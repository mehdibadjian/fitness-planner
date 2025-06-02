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

const fitnessTrackingSchema = z.object({
  goalType: z.string().min(1, "Goal type is required"),
  targetValue: z.number().min(0, "Target value must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  value: z.number().min(0, "Value must be positive"),
  notes: z.string().optional(),
});

type FitnessTrackingFormValues = z.infer<typeof fitnessTrackingSchema>;

interface FitnessTrackingFormProps {
  userId: number;
  onSuccess?: () => void;
}

export function FitnessTrackingForm({ userId, onSuccess }: FitnessTrackingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FitnessTrackingFormValues>({
    resolver: zodResolver(fitnessTrackingSchema),
    defaultValues: {
      goalType: "",
      targetValue: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      value: 0,
      notes: "",
    },
  });

  async function onSubmit(data: FitnessTrackingFormValues) {
    try {
      setIsSubmitting(true);

      // First create the goal
      const goalResponse = await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "fitness",
          data: {
            userId,
            goalType: data.goalType,
            targetValue: data.targetValue,
            startDate: data.startDate,
            endDate: data.endDate,
          },
        }),
      });

      if (!goalResponse.ok) {
        throw new Error("Failed to create fitness goal");
      }

      const goal = await goalResponse.json();

      // Then record the progress
      const progressResponse = await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "fitness-progress",
          data: {
            userId,
            goalId: goal.lastInsertRowid,
            value: data.value,
            date: new Date().toISOString().split("T")[0],
            notes: data.notes,
          },
        }),
      });

      if (!progressResponse.ok) {
        throw new Error("Failed to record fitness progress");
      }

      toast.success("Fitness progress recorded successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to record fitness progress");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="goalType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Weight, Reps, Distance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="targetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 75"
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
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 70"
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