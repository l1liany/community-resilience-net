import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Heart, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RouteError, RouteNotFound } from "@/components/route-boundaries";
import { organizationsQuery } from "@/lib/data";

export const Route = createFileRoute("/funding")({
  head: () => ({
    meta: [
      { title: "Donations & Crowdfunding — HopeBridge" },
      {
        name: "description",
        content:
          "Support disaster recovery through verified crowdfunding campaigns and donation funds, or find financial assistance programs for your rebuild.",
      },
      { property: "og:title", content: "Donations & Crowdfunding — HopeBridge" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(organizationsQuery());
  },
  component: Funding,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

const campaigns = [
  {
    id: "c1",
    title: "Rebuild the Riverside Community Center",
    location: "Western Region",
    raised: 48200,
    goal: 75000,
    donors: 412,
  },
  {
    id: "c2",
    title: "Emergency Roofing for Storm-Hit Families",
    location: "Southeast",
    raised: 23900,
    goal: 40000,
    donors: 268,
  },
  {
    id: "c3",
    title: "Clean Water & Wells After the Drought",
    location: "Midwest",
    raised: 61500,
    goal: 80000,
    donors: 537,
  },
];

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Funding() {
  const { data: orgs } = useSuspenseQuery(organizationsQuery());
  const fundingPrograms = orgs.filter((o) => o.amount_label).slice(0, 4);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <header className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            Fund recovery, or find funding
          </h1>
          <p className="mt-3 text-muted-foreground">
            Every contribution rebuilds a home, a business, or a neighborhood. Give to a
            verified campaign, or explore financial assistance you may qualify for.
          </p>
        </header>

        {/* Crowdfunding campaigns */}
        <section className="mt-12">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="size-5 text-accent" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Active campaigns
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {campaigns.map((c) => {
              const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
              return (
                <article
                  key={c.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {c.location}
                  </span>
                  <h3 className="mt-2 font-serif text-lg font-semibold text-foreground">
                    {c.title}
                  </h3>
                  <div className="mt-5 flex-1">
                    <Progress value={pct} className="h-2" />
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="font-semibold text-foreground">
                        {currency(c.raised)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        of {currency(c.goal)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {pct}% funded • {c.donors} donors
                    </p>
                  </div>
                  <Button className="mt-6 rounded-full">
                    <Heart className="size-4" /> Donate
                  </Button>
                </article>
              );
            })}
          </div>
        </section>

        {/* Financial assistance programs */}
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-semibold text-foreground">
            Financial assistance you may qualify for
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fundingPrograms.map((o) => (
              <article
                key={o.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div>
                  <h3 className="font-semibold text-foreground">{o.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{o.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block font-semibold text-accent">{o.amount_label}</span>
                  {o.deadline && (
                    <span className="text-xs text-muted-foreground">{o.deadline}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
