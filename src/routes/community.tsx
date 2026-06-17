import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Users, MessageCircle, HeartHandshake } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { RouteError, RouteNotFound } from "@/components/route-boundaries";
import { supportGroupsQuery } from "@/lib/data";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Support Groups — Rebuild Together" },
      {
        name: "description",
        content:
          "Join community support groups to connect with others recovering from disasters, share resources, and find or offer volunteer help.",
      },
      { property: "og:title", content: "Community Support Groups — Rebuild Together" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(supportGroupsQuery());
  },
  component: Community,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function Community() {
  const { data: groups } = useSuspenseQuery(supportGroupsQuery());

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <header className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            You're part of a community
          </h1>
          <p className="mt-3 text-muted-foreground">
            Connect with people who understand what you're going through. Share resources,
            ask questions, and lend a hand where you can.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <article
              key={g.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-brand-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-800">
                  {g.topic}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <Users className="size-3.5" aria-hidden="true" />
                  {g.member_count.toLocaleString()}
                </span>
              </div>
              <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">
                {g.name}
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{g.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">{g.region}</span>
                <Button size="sm" className="rounded-full">
                  <MessageCircle className="size-4" /> Join Group
                </Button>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-16 rounded-3xl bg-primary p-8 text-primary-foreground md:p-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex size-11 items-center justify-center rounded-2xl bg-primary-foreground/15">
                <HeartHandshake className="size-6" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-2xl font-semibold md:text-3xl">
                Want to help others rebuild?
              </h2>
              <p className="mt-2 text-primary-foreground/75">
                Offer your time, tools, or skills. Volunteers are the backbone of every
                recovery.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link to="/report">Become a volunteer</Link>
            </Button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
