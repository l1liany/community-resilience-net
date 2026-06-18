import { useState, type FormEvent } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type RecommendedOrg = {
  id: string;
  name: string;
  category: "government" | "non_profit" | "community" | "donor";
  description: string;
  amount_label: string | null;
  region: string;
};

const categoryLabel: Record<RecommendedOrg["category"], string> = {
  government: "Government",
  non_profit: "Non-Profit",
  community: "Community",
  donor: "Donor",
};

export function AssistantPanel({ initialSituation = "" }: { initialSituation?: string }) {
  const [situation, setSituation] = useState(initialSituation);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ message: string; recommended: RecommendedOrg[] } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;
    
    setIsPending(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: situation.trim() }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to communicate with AI backend.");
      }
      
      const json = await res.json();

      setData({
        message: json.reply,
        recommended: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-2 shadow-card"
      >
        <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="situation"
              className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-accent"
            >
              <Sparkles className="size-4" aria-hidden="true" /> AI Assistant
            </label>
            <Textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="I need help with home repairs and temporary housing after a flood in Asheville..."
              rows={3}
              maxLength={2000}
              className="resize-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending || !situation.trim()}
            className="rounded-xl"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" /> Finding aid
              </>
            ) : (
              <>
                <Send /> Find Aid
              </>
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {(isPending || data) && (
        <div className="animate-fade-up space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-accent">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" aria-hidden="true" />} Recommendation
            </div>
            <p className="whitespace-pre-line leading-relaxed text-foreground text-lg">
              {isPending ? "Thinking..." : data?.message}
            </p>
          </div>

          {!isPending && data && data.recommended.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.recommended.map((org) => (
                <div
                  key={org.id}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-800">
                      {categoryLabel[org.category]}
                    </span>
                    {org.amount_label && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {org.amount_label}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-foreground">
                    {org.name}
                  </h4>
                  <p className="mt-1.5 text-sm text-muted-foreground">{org.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
