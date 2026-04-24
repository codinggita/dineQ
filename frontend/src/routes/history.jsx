import { PageShell } from '@/components/layout/PageShell';
import { Calendar, Clock, MapPin, Star, Receipt, RotateCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const visits = [
    {
      id: 'v1',
      name: 'Ember & Oak',
      date: 'Mar 18, 2025 · 8:15 PM',
      party: 2,
      waited: 22,
      total: 148.5,
      rating: 5,
      cuisine: 'Modern Steakhouse',
      image:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      status: 'completed',
    },
    {
      id: 'v2',
      name: 'Saffron House',
      date: 'Mar 12, 2025 · 7:30 PM',
      party: 4,
      waited: 18,
      total: 212.0,
      rating: 4,
      cuisine: 'Indian · Tasting',
      image:
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
      status: 'completed',
    },
    {
      id: 'v3',
      name: 'Trattoria Luce',
      date: 'Mar 5, 2025 · 1:00 PM',
      party: 3,
      waited: 8,
      total: 78.4,
      rating: 5,
      cuisine: 'Italian',
      image:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      status: 'completed',
    },
    {
      id: 'v4',
      name: 'Kaiseki Mori',
      date: 'Feb 24, 2025 · 9:00 PM',
      party: 2,
      waited: 0,
      total: 0,
      rating: 0,
      cuisine: 'Japanese Omakase',
      image:
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=600&q=80',
      status: 'cancelled',
    },
  ];

  const completed = visits.filter((v) => v.status === 'completed');
  const totalSpent = completed.reduce((s, v) => s + v.total, 0);
  const avgWait = Math.round(completed.reduce((s, v) => s + v.waited, 0) / completed.length);

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold">Activity</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-1">Visit history</h1>
          <p className="text-muted-foreground mt-2">Your dining timeline at a glance.</p>
        </div>

        {loading ? (
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card p-5 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Summary label="Total visits" value={completed.length.toString()} />
            <Summary label="Avg wait" value={`${avgWait} min`} />
            <Summary label="Lifetime spend" value={`$${totalSpent.toFixed(0)}`} accent />
          </div>
        )}

        {loading ? (
          <div className="mt-10 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 bg-card overflow-hidden p-6"
              >
                <div className="flex gap-4">
                  <Skeleton className="h-32 w-48 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="mt-10 space-y-4">
            {visits.map((v) => (
              <li
                key={v.id}
                className="rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-gold/30 transition"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 sm:h-auto h-40 relative">
                    <img src={v.image} alt={v.name} className="h-full w-full object-cover" />
                    {v.status === 'cancelled' && (
                      <div className="absolute inset-0 bg-background/70 grid place-items-center">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-destructive/20 text-destructive font-medium">
                          Cancelled
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="font-display text-lg font-semibold">{v.name}</h3>
                          <p className="text-sm text-muted-foreground">{v.cuisine}</p>
                        </div>
                        {v.status === 'completed' && v.rating > 0 && (
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < v.rating ? 'fill-gold text-gold' : 'text-muted-foreground/30'}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {v.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> Party of {v.party}
                        </span>
                        {v.status === 'completed' && (
                          <>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> Waited {v.waited} min
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Receipt className="h-3.5 w-3.5" /> ${v.total.toFixed(2)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button className="px-3 py-2 rounded-lg border border-border hover:border-gold hover:text-gold text-sm inline-flex items-center gap-1.5">
                        <RotateCw className="h-3.5 w-3.5" /> Book again
                      </button>
                      {v.status === 'completed' && (
                        <button className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground text-sm">
                          Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}

function Summary({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-3xl font-bold ${accent ? 'gradient-text-gold' : ''}`}>
        {value}
      </p>
    </div>
  );
}
