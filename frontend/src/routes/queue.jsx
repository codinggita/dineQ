import { Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { Bell, MapPin, Users, Clock, ShoppingBag, X, Plus, Minus } from "lucide-react";
import { useState } from "react";

export default function QueuePage() {
  const [cart, setCart] = useState({});
  const position = 4;
  const total = 12;
  const eta = 18;
  const progress = ((total - position) / total) * 100;

  const menu = [
    { id: "m1", name: "Wood-fired bread, cultured butter", price: 8 },
    { id: "m2", name: "Beef tartare, smoked yolk", price: 22 },
    { id: "m3", name: "Black truffle tagliatelle", price: 36 },
    { id: "m4", name: "Dry-aged ribeye, 12oz", price: 64 },
    { id: "m5", name: "Charred carrots, harissa", price: 14 },
    { id: "m6", name: "Burnt basque cheesecake", price: 12 },
  ];

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const sub = (id) =>
    setCart((c) => {
      const n = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });

  const cartTotal = Object.entries(cart).reduce(
    (sum, [id, q]) => sum + (menu.find((m) => m.id === id)?.price ?? 0) * q,
    0,
  );
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-gold/20 bg-card overflow-hidden">
              <div className="relative h-48 sm:h-56">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80"
                  alt="Ember & Oak"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.16_145)] animate-pulse" />{" "}
                    Live queue
                  </span>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-display font-bold">Ember & Oak</h1>
                  <p className="text-sm text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> Downtown · Modern Steakhouse
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <Stat icon={Users} label="Position" value={`#${position}`} />
                  <Stat icon={Clock} label="ETA" value={`${eta} min`} accent />
                  <Stat icon={Bell} label="Party of" value="2" />
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Started 24 min ago</span>
                    <span>{Math.round(progress)}% there</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full gradient-gold transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="px-4 py-2.5 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 text-sm">
                    Notify me when ready
                  </button>
                  <button className="px-4 py-2.5 rounded-lg border border-border hover:border-destructive/40 hover:text-destructive text-sm inline-flex items-center gap-1.5">
                    <X className="h-4 w-4" /> Leave queue
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-display text-2xl font-semibold">Pre-order while you wait</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your food fires the moment you're seated.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gold/10 text-gold">
                  Saves ~14 min
                </span>
              </div>

              <ul className="mt-6 divide-y divide-border/60">
                {menu.map((m) => {
                  const qty = cart[m.id] ?? 0;
                  return (
                    <li key={m.id} className="py-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">{m.name}</p>
                        <p className="text-sm text-muted-foreground">${m.price.toFixed(2)}</p>
                      </div>
                      {qty === 0 ? (
                        <button
                          onClick={() => add(m.id)}
                          className="px-3 py-1.5 rounded-lg border border-border hover:border-gold hover:text-gold text-sm inline-flex items-center gap-1"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/5 px-1">
                          <button onClick={() => sub(m.id)} className="p-1.5 hover:text-gold">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-sm font-medium w-5 text-center">{qty}</span>
                          <button onClick={() => add(m.id)} className="p-1.5 hover:text-gold">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card p-6 sticky top-24">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold" /> Your pre-order
              </h3>

              {cartCount === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  No items yet. Add dishes from the menu to skip the kitchen wait.
                </p>
              ) : (
                <ul className="mt-4 space-y-2 text-sm">
                  {Object.entries(cart).map(([id, q]) => {
                    const m = menu.find((x) => x.id === id);
                    return (
                      <li key={id} className="flex justify-between gap-2">
                        <span className="text-muted-foreground truncate">
                          {q}× {m.name}
                        </span>
                        <span className="font-medium">${(m.price * q).toFixed(2)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-xl font-bold gradient-text-gold">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <button
                disabled={cartCount === 0}
                className="mt-4 w-full px-4 py-2.5 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              >
                Confirm pre-order
              </button>

              <p className="mt-3 text-xs text-muted-foreground text-center">
                You won't be charged until you sit down.
              </p>
            </div>

            <Link to="/restaurants" className="block text-center text-sm text-gold hover:underline">
              ← Browse other restaurants
            </Link>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl bg-surface p-4">
      <div className="text-xs text-muted-foreground inline-flex items-center gap-1 justify-center">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className={`mt-1 font-display text-2xl font-bold ${accent ? "gradient-text-gold" : ""}`}>
        {value}
      </p>
    </div>
  );
}
