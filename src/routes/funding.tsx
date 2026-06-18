import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Heart, TrendingUp, X, Loader2, CheckCircle2 } from "lucide-react";
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
    title: "Mathare Flood Recovery",
    location: "Nairobi",
    raised: 482000,
    goal: 750000,
    donors: 412,
  },
  {
    id: "c2",
    title: "Emergency Roofing for Storm-Hit Families",
    location: "Western Region",
    raised: 239000,
    goal: 400000,
    donors: 268,
  },
  {
    id: "c3",
    title: "Clean Water & Wells After the Drought",
    location: "Northern Kenya",
    raised: 615000,
    goal: 800000,
    donors: 537,
  },
];

const currency = (n: number) =>
  `KES ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

function DonateModal({ campaign, onClose }: { campaign: any, onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    try {
      const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/donate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount, paybill: "222911", account: "HOPE-RELIEF" })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="size-5" />
        </button>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-1">Donate with M-Pesa</h2>
        <p className="text-sm text-muted-foreground mb-6">Supporting {campaign.title}</p>
        
        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <CheckCircle2 className="size-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-emerald-700 dark:text-emerald-300 font-medium">{success}</p>
            <Button onClick={onClose} className="mt-4 w-full" variant="outline">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleDonate} className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-4 mb-6 border border-border">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Paybill Number:</span>
                <span className="font-bold text-foreground">222911</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-bold text-foreground">HOPE-RELIEF</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">M-Pesa Phone Number</label>
              <input 
                type="tel" 
                required 
                placeholder="e.g. 0700 000 000"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Amount (KES)</label>
              <input 
                type="number" 
                required 
                placeholder="Amount in KES"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Heart className="size-4 mr-2" />}
              {loading ? "Processing..." : "Donate via STK Push"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function Funding() {
  const { data: orgs } = useSuspenseQuery(organizationsQuery());
  const fundingPrograms = orgs.filter((o) => o.amount_label).slice(0, 4);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

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
                  <Button onClick={() => setSelectedCampaign(c)} className="mt-6 rounded-full">
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
      
      {selectedCampaign && (
        <DonateModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />
      )}
    </PageShell>
  );
}

