import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  FileCheck,
  Home,
  ShieldAlert,
  HeartPulse,
  Banknote,
  Bell,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { RouteError, RouteNotFound } from "@/components/route-boundaries";
import { reliefUpdatesQuery } from "@/lib/data";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Disaster Recovery Resource Hub — HopeBridge" },
      {
        name: "description",
        content:
          "Step-by-step disaster recovery guides plus real-time updates on relief programs, shelters, and assistance in your area.",
      },
      { property: "og:title", content: "Recovery Resource Hub — HopeBridge" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(reliefUpdatesQuery());
  },
  component: Resources,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

const guides = [
  {
    icon: ShieldAlert,
    title: "Immediately after a disaster",
    body: "Safety first: how to check for hazards, document damage, and reach emergency services.",
    tag: "Safety",
  },
  {
    icon: FileCheck,
    title: "Filing insurance & FEMA claims",
    body: "A clear checklist for documenting losses and submitting claims without delays.",
    tag: "Paperwork",
  },
  {
    icon: Home,
    title: "Finding temporary housing",
    body: "Options for shelter, rental assistance, and relocation support while you rebuild.",
    tag: "Housing",
  },
  {
    icon: Banknote,
    title: "Applying for grants & loans",
    body: "Understand eligibility, gather documents, and avoid common application mistakes.",
    tag: "Funding",
  },
  {
    icon: HeartPulse,
    title: "Caring for your wellbeing",
    body: "Recovery is emotional too. Resources for stress, grief, and mental health support.",
    tag: "Wellbeing",
  },
  {
    icon: BookOpen,
    title: "Rebuilding stronger",
    body: "Resilient construction tips and how to find trustworthy contractors.",
    tag: "Rebuilding",
  },
];

const severityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  info: "bg-brand-100 text-brand-800",
};

function Resources() {
  const { data: fetchedUpdates } = useQuery(reliefUpdatesQuery());
  const [updates, setUpdates] = useState(fetchedUpdates || []);

  useEffect(() => {
    if (fetchedUpdates) {
      setUpdates(fetchedUpdates);
    }
  }, [fetchedUpdates]);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <header className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            Recovery resource hub
          </h1>
          <p className="mt-3 text-muted-foreground">
            Practical, plain-language guides for every stage of recovery — plus live updates
            on the programs available to you.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Guides */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-foreground">
              Recovery guides
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {guides.map((g) => (
                <Link
                  to={`/resources/guides/${g.tag.toLowerCase()}`}
                  key={g.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-soft block"
                >
                  <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
                    <g.icon className="size-5" aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-brand-400">
                    {g.tag}
                  </span>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">
                    {g.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{g.body}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Real-time updates */}
          <aside>
            <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-semibold text-foreground">
              <Bell className="size-5 text-accent" aria-hidden="true" /> Live updates
            </h2>
            <div className="space-y-4">
              {(updates || []).map((u) => (
                <article
                  key={u.id}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        severityStyles[u.severity] ?? severityStyles.info
                      }`}
                    >
                      {u.severity}
                    </span>
                    <span className="text-xs text-muted-foreground">{u.region}</span>
                  </div>
                  <h3 className="mt-3 font-semibold leading-snug text-foreground">
                    {u.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{u.body}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
