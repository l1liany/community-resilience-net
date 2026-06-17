import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, ShieldCheck, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RouteError, RouteNotFound } from "@/components/route-boundaries";
import { organizationsQuery } from "@/lib/data";

export const Route = createFileRoute("/organizations")({
  head: () => ({
    meta: [
      { title: "Verified Aid Organizations & Funding — HopeBridge" },
      {
        name: "description",
        content:
          "Browse a directory of verified NGOs, government programs, donors, and community funds offering disaster recovery assistance.",
      },
      { property: "og:title", content: "Verified Aid Organizations — HopeBridge" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(organizationsQuery());
  },
  component: Organizations,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

const filters = [
  { value: "all", label: "All" },
  { value: "government", label: "Government" },
  { value: "non_profit", label: "Non-Profit" },
  { value: "community", label: "Community" },
  { value: "donor", label: "Donor" },
] as const;

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

function Organizations() {
  const { data: orgs } = useSuspenseQuery(organizationsQuery());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orgs.filter((o) => {
      const matchesFilter = filter === "all" || o.category === filter;
      const matchesQuery =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.tags.some((t) => t.toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    });
  }, [orgs, query, filter]);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <header className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            Verified aid &amp; funding
          </h1>
          <p className="mt-3 text-muted-foreground">
            Every organization listed here is vetted. Search by need, location, or program
            type to find the right support.
          </p>
        </header>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programs, e.g. housing, grants, flood..."
              className="pl-9"
              aria-label="Search aid programs"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => (
            <article
              key={o.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-xl bg-brand-100 font-serif font-bold text-brand-800">
                  {o.name.charAt(0)}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${categoryStyles[o.category]}`}
                >
                  {categoryLabel[o.category]}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1.5">
                <h2 className="font-semibold text-foreground">{o.name}</h2>
                {o.verified && (
                  <ShieldCheck
                    className="size-4 text-accent"
                    aria-label="Verified organization"
                  />
                )}
              </div>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{o.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {o.region}
                </span>
                {o.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div className="text-sm">
                  {o.amount_label && (
                    <span className="font-semibold text-foreground">{o.amount_label}</span>
                  )}
                  {o.deadline && (
                    <span className="block text-xs text-muted-foreground">
                      Deadline: {o.deadline}
                    </span>
                  )}
                </div>
                <Button size="sm" className="rounded-full">
                  Apply <ExternalLink className="size-3.5" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">
            No programs match your search. Try a different term or filter.
          </p>
        )}
      </div>
    </PageShell>
  );
}
