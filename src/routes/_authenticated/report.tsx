import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RouteError, RouteNotFound } from "@/components/route-boundaries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/report")({
  head: () => ({
    meta: [{ title: "Report Disaster Damage — HopeBridge" }],
  }),
  component: ReportPage,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

type DisasterType = Database["public"]["Enums"]["disaster_type"];

const disasterTypes: { value: DisasterType; label: string }[] = [
  { value: "flood", label: "Flood" },
  { value: "earthquake", label: "Earthquake" },
  { value: "drought", label: "Drought" },
  { value: "landslide", label: "Landslide" },
  { value: "storm", label: "Storm" },
  { value: "wildfire", label: "Wildfire" },
  { value: "other", label: "Other" },
];

const needOptions = [
  "Housing",
  "Financial aid",
  "Food & water",
  "Medical care",
  "Rebuilding materials",
  "Volunteers & labor",
  "Mental health support",
  "Transportation",
];

const reportSchema = z.object({
  disaster_type: z.enum([
    "flood",
    "earthquake",
    "drought",
    "landslide",
    "storm",
    "wildfire",
    "other",
  ]),
  location: z.string().trim().min(2, "Please enter a location").max(160),
  description: z
    .string()
    .trim()
    .min(10, "Please describe what happened (at least 10 characters)")
    .max(2000),
});

function ReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [disasterType, setDisasterType] = useState<DisasterType | "">("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState([3]);
  const [needs, setNeeds] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = reportSchema.parse({
        disaster_type: disasterType,
        location,
        description,
      });
      const { error } = await supabase.from("disaster_reports").insert({
        user_id: user!.id,
        disaster_type: parsed.disaster_type,
        location: parsed.location,
        description: parsed.description,
        severity: severity[0],
        needs,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disaster_reports"] });
      toast.success("Report submitted. We're matching you with support.");
      navigate({ to: "/dashboard" });
    },
    onError: (err) => {
      toast.error((err as Error).message);
    },
  });

  const toggleNeed = (need: string) =>
    setNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need],
    );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!disasterType) {
      toast.error("Please select a disaster type.");
      return;
    }
    mutation.mutate();
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <header>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Report disaster damage
          </h1>
          <p className="mt-2 text-muted-foreground">
            Share what happened and what you need. The more detail you provide, the better
            we can match you with the right aid.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8"
        >
          <div>
            <Label htmlFor="disaster_type">Type of disaster</Label>
            <Select
              value={disasterType}
              onValueChange={(v) => setDisasterType(v as DisasterType)}
            >
              <SelectTrigger id="disaster_type" className="mt-1.5">
                <SelectValue placeholder="Select a disaster type" />
              </SelectTrigger>
              <SelectContent>
                {disasterTypes.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, region, or address"
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">What happened?</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the damage and your most urgent needs..."
              rows={5}
              maxLength={2000}
              className="mt-1.5 resize-none"
              required
            />
          </div>

          <div>
            <Label htmlFor="severity">
              Severity: <span className="text-accent">{severity[0]} of 5</span>
            </Label>
            <Slider
              id="severity"
              min={1}
              max={5}
              step={1}
              value={severity}
              onValueChange={setSeverity}
              className="mt-3"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>Minor</span>
              <span>Severe</span>
            </div>
          </div>

          <div>
            <Label>What support do you need?</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {needOptions.map((need) => {
                const active = needs.includes(need);
                return (
                  <button
                    key={need}
                    type="button"
                    onClick={() => toggleNeed(need)}
                    aria-pressed={active}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-accent/40"
                    }`}
                  >
                    {need}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-full"
            size="lg"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="animate-spin" />}
            Submit report
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Your information is private and only used to match you with support.
          </p>
        </form>
      </div>
    </PageShell>
  );
}
