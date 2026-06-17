import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { AssistantPanel } from "@/components/AssistantPanel";
import { RouteError, RouteNotFound } from "@/components/route-boundaries";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Recovery Assistant — Rebuild Together" },
      {
        name: "description",
        content:
          "Describe your situation and our AI assistant recommends the most relevant disaster aid programs, grants, and community support for you.",
      },
      { property: "og:title", content: "AI Recovery Assistant — Rebuild Together" },
    ],
  }),
  component: Assistant,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

const prompts = [
  "My home flooded and I need help with repairs and temporary housing.",
  "I'm a small business owner who lost inventory in a storm.",
  "My farm is struggling after months of drought — what aid exists?",
  "An earthquake damaged my home's foundation. Where do I start?",
];

function Assistant() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <header className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
            <Sparkles className="size-6" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            Find the right aid, faster
          </h1>
          <p className="mt-3 text-muted-foreground">
            Tell us what happened and what you need. Our assistant will match you with
            relevant programs and support.
          </p>
        </header>

        <div className="mt-10">
          <AssistantPanel />
        </div>

        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Not sure where to start? Try one of these:
          </p>
          <div className="flex flex-wrap gap-2">
            {prompts.map((p) => (
              <span
                key={p}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
