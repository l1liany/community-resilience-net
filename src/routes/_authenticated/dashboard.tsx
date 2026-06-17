import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FilePlus2,
  CheckCircle2,
  Clock3,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RouteError, RouteNotFound } from "@/components/route-boundaries";
import { useAuth } from "@/hooks/use-auth";
import { myReportsQuery, organizationsQuery, type DisasterReport } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Your Recovery Dashboard — Rebuild Together" }],
  }),
  component: Dashboard,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

const statusOrder: DisasterReport["status"][] = [
  "submitted",
  "under_review",
  "matched",
  "in_progress",
  "resolved",
];

const statusLabel: Record<DisasterReport["status"], string> = {
  submitted: "Submitted",
  under_review: "Under review",
  matched: "Matched with aid",
  in_progress: "In progress",
  resolved: "Resolved",
};

const disasterLabel: Record<string, string> = {
  flood: "Flood",
  earthquake: "Earthquake",
  drought: "Drought",
  landslide: "Landslide",
  storm: "Storm",
  wildfire: "Wildfire",
  other: "Other",
};

function progressFor(status: DisasterReport["status"]) {
  const idx = statusOrder.indexOf(status);
  return Math.round(((idx + 1) / statusOrder.length) * 100);
}

function Dashboard() {
  const { user } = useAuth();
  const { data: reports = [], isLoading } = useQuery(myReportsQuery(user?.id));
  const { data: orgs = [] } = useQuery(organizationsQuery());

  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "there";

  const recommended = orgs.slice(0, 3);
  const latest = reports[0];

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Welcome, {firstName}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here's where your recovery stands today.
            </p>
          </div>
          <Button asChild className="rounded-full">
            <Link to="/report">
              <FilePlus2 className="size-4" /> New report
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <p className="mt-12 text-muted-foreground">Loading your reports…</p>
        ) : reports.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Let's start your recovery
            </h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Report what happened and what you need. We'll match you with relevant aid and
              support right away.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/report">Report damage</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Reports */}
            <div className="space-y-6 lg:col-span-2">
              {latest && (
                <div className="rounded-2xl border border-border bg-card p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-lg font-semibold text-foreground">
                        {disasterLabel[latest.disaster_type]} recovery —{" "}
                        {latest.location}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {statusLabel[latest.status]}
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-bold text-brand-800">
                      {progressFor(latest.status)}%
                    </span>
                  </div>
                  <Progress value={progressFor(latest.status)} className="mt-6 h-3" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {latest.needs.map((n) => (
                      <span
                        key={n}
                        className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="font-serif text-xl font-semibold text-foreground">
                All reports
              </h3>
              <div className="space-y-3">
                {reports.map((r) => (
                  <article
                    key={r.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {r.status === "resolved" ? (
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                        ) : (
                          <Clock3 className="size-4 shrink-0 text-accent" />
                        )}
                        <h4 className="truncate font-semibold text-foreground">
                          {disasterLabel[r.disaster_type]} — {r.location}
                        </h4>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {r.description}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-muted-foreground">
                      {statusLabel[r.status]}
                    </span>
                  </article>
                ))}
              </div>
            </div>

            {/* Recommended aid */}
            <aside className="space-y-4">
              <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4" aria-hidden="true" /> Recovery Assistant
                </div>
                <p className="mt-2 text-sm text-primary-foreground/75">
                  Describe your situation to find specific programs you may qualify for.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="mt-4 w-full rounded-full"
                >
                  <Link to="/assistant">Ask the assistant</Link>
                </Button>
              </div>

              <h3 className="px-1 pt-2 font-serif text-lg font-semibold text-foreground">
                Recommended aid
              </h3>
              {recommended.map((o) => (
                <Link
                  key={o.id}
                  to="/organizations"
                  className="block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-foreground">{o.name}</h4>
                    <ArrowRight className="size-4 shrink-0 text-accent" />
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {o.description}
                  </p>
                </Link>
              ))}
            </aside>
          </div>
        )}
      </div>
    </PageShell>
  );
}
