import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  FileText,
  ShieldCheck,
  Users,
  ArrowRight,
  Navigation,
  Phone,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { AssistantPanel } from "@/components/AssistantPanel";
import { Button } from "@/components/ui/button";
import { RouteError, RouteNotFound } from "@/components/route-boundaries";
import {
  organizationsQuery,
  assistanceCentersQuery,
} from "@/lib/data";
import mapPreview from "@/assets/map-preview.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HopeBridge — Recover After Disaster, Together" },
      {
        name: "description",
        content:
          "Find verified aid, financial grants, recovery resources, and community support after floods, earthquakes, storms, and other disasters.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(organizationsQuery());
    context.queryClient.ensureQueryData(assistanceCentersQuery());
  },
  component: Index,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

const categoryStyles: Record<string, string> = {
  government: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  non_profit: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  community: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  donor: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};

const categoryLabel: Record<string, string> = {
  government: "Government",
  non_profit: "Non-Profit",
  community: "Community",
  donor: "Donor",
};

const actions = [
  {
    n: "1",
    icon: FileText,
    title: "Report Damage",
    body: "Submit your situation and documentation for faster aid matching.",
    cta: "Start Report",
    to: "/report" as const,
  },
  {
    n: "2",
    icon: ShieldCheck,
    title: "Verified Aid",
    body: "Browse vetted NGOs and government grants currently accepting applications.",
    cta: "Search Programs",
    to: "/organizations" as const,
  },
  {
    n: "3",
    icon: Users,
    title: "Local Help",
    body: "Connect with nearby community groups offering meals, tools, and labor.",
    cta: "Join Group",
    to: "/community" as const,
  },
];

function Index() {
  const { data: orgs } = useSuspenseQuery(organizationsQuery());
  const { data: centers } = useSuspenseQuery(assistanceCentersQuery());
  const nearest = centers[0];
  const programs = orgs.slice(0, 3);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">
        {/* Hero */}
        <section className="mb-16 animate-fade-up">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl font-semibold leading-[1.1] text-foreground md:text-6xl">
              You aren't rebuilding <span className="italic text-accent">alone.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Find immediate aid, financial grants, and local support networks tailored to
              your specific situation.
            </p>
            <div className="mt-10">
              <AssistantPanel />
            </div>
          </div>
        </section>

        {/* Quick action cards */}
        <section className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          {actions.map((a) => (
            <div
              key={a.n}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:shadow-soft"
            >
              <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
                <a.icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-foreground">
                {a.title}
              </h3>
              <p className="mt-3 text-muted-foreground">{a.body}</p>
              <Link
                to={a.to}
                className="mt-6 inline-flex items-center font-semibold text-accent"
              >
                {a.cta}
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </section>

        {/* Map preview */}
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-foreground">
                Assistance Near You
              </h2>
              <p className="mt-2 text-muted-foreground">
                Temporary shelters and distribution centers updated in real time.
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden shrink-0 text-accent sm:inline-flex">
              <Link to="/map">Expand map view</Link>
            </Button>
          </div>
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-border">
            <img
              src={mapPreview}
              alt="Map showing nearby relief and assistance centers"
              width={1440}
              height={600}
              loading="lazy"
              className="h-[320px] w-full object-cover md:h-[420px]"
            />
            {nearest && (
              <div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-2xl bg-card/95 p-6 shadow-soft backdrop-blur-sm sm:bottom-6 sm:left-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
                    Nearest Center
                  </span>
                  {nearest.is_open && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      ● Active Now
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {nearest.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {nearest.address} • {nearest.services.slice(0, 3).join(", ")}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to="/map">
                      <Navigation className="size-4" /> Get Directions
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" aria-label="Call center">
                    <Phone className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Current relief programs */}
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Current Relief Programs
            </h2>
            <Button asChild variant="ghost" className="hidden shrink-0 text-accent sm:inline-flex">
              <Link to="/organizations">View all</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <div key={p.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div className="grid size-12 place-items-center rounded-xl bg-brand-100 font-serif font-bold text-brand-800">
                    {p.name.charAt(0)}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${categoryStyles[p.category]}`}
                  >
                    {categoryLabel[p.category]}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{p.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs font-medium text-muted-foreground">
                    {p.amount_label ?? p.deadline ?? "Available now"}
                  </span>
                  <Link
                    to="/organizations"
                    className="text-sm font-semibold text-accent"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community CTA */}
        <section className="rounded-[2.5rem] bg-primary p-8 text-primary-foreground md:p-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-3xl font-semibold md:text-5xl">
              The heart of recovery is community.
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/75">
              Connect with others who have faced similar challenges. Share resources, find
              volunteers, or just talk with people who understand.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full"
              >
                <Link to="/community">Browse support groups</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/community">Become a volunteer</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
