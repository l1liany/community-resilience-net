import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Users, MessageCircle, HeartHandshake, X, Send, CheckSquare, UserPlus } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { RouteError, RouteNotFound } from "@/components/route-boundaries";
import { supportGroupsQuery } from "@/lib/data";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Support Groups — HopeBridge" },
      {
        name: "description",
        content:
          "Join community support groups to connect with others recovering from disasters, share resources, and find or offer volunteer help.",
      },
      { property: "og:title", content: "Community Support Groups — HopeBridge" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(supportGroupsQuery());
  },
  component: Community,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function GroupPortalModal({ group, onClose }: { group: any, onClose: () => void }) {
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, user: "Amina K.", text: "We need 5 more volunteers at the distribution center.", time: "10:30 AM" },
    { id: 2, user: "David O.", text: "On my way! Bringing extra bottled water.", time: "10:32 AM" }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: "Sort donations at Mathare Social Hall", claimed: false },
    { id: 2, title: "Distribute blankets to temporary shelter", claimed: true },
    { id: 3, title: "Help clean up debris on Juja Road", claimed: false }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    setMessages([...messages, { id: Date.now(), user: "You", text: chatMsg, time: "Just now" }]);
    setChatMsg("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, claimed: !t.claimed } : t));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-card border border-border flex flex-col md:flex-row shadow-xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh]">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 text-muted-foreground hover:text-foreground bg-card rounded-full p-1 shadow-sm">
          <X className="size-5" />
        </button>
        
        {/* Left Side: Info & Tasks */}
        <div className="w-full md:w-1/3 bg-muted/30 p-6 border-r border-border overflow-y-auto">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-2 pr-6">{group.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="size-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold border-2 border-card">
                  {String.fromCharCode(64+i)}
                </div>
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">+{group.member_count} members</span>
          </div>

          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckSquare className="size-4 text-brand-500" /> Active Tasks
          </h3>
          <ul className="space-y-3">
            {tasks.map(t => (
              <li key={t.id} className="flex items-start gap-3 bg-card p-3 rounded-xl border border-border">
                <input 
                  type="checkbox" 
                  checked={t.claimed}
                  onChange={() => toggleTask(t.id)}
                  className="mt-1 size-4 rounded border-border text-brand-500 focus:ring-brand-500"
                />
                <span className={`text-sm ${t.claimed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {t.title}
                </span>
              </li>
            ))}
          </ul>
          
          <Button className="w-full mt-6" variant="outline">
            <UserPlus className="size-4 mr-2" /> Share Invite Link
          </Button>
        </div>

        {/* Right Side: Chat Widget */}
        <div className="w-full md:w-2/3 flex flex-col bg-card h-[60vh] md:h-auto">
          <div className="p-4 border-b border-border bg-muted/10 flex items-center gap-2">
            <MessageCircle className="size-5 text-accent" />
            <h3 className="font-semibold text-foreground">Live Community Chat</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(m => (
              <div key={m.id} className={`flex flex-col max-w-[80%] ${m.user === "You" ? "ml-auto items-end" : "mr-auto items-start"}`}>
                <span className="text-[10px] text-muted-foreground mb-1 px-1">{m.user} • {m.time}</span>
                <div className={`px-4 py-2 rounded-2xl text-sm ${m.user === "You" ? "bg-accent text-accent-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-border bg-muted/10 flex gap-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button type="submit" size="icon" className="rounded-full shrink-0">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Community() {
  const { data: groups } = useSuspenseQuery(supportGroupsQuery());
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

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
                <Button onClick={() => setSelectedGroup(g)} size="sm" className="rounded-full">
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
      
      {selectedGroup && (
        <GroupPortalModal group={selectedGroup} onClose={() => setSelectedGroup(null)} />
      )}
    </PageShell>
  );
}
