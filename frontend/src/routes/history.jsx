import { PageShell } from '@/components/layout/PageShell';
import { Calendar, Clock, MapPin, Receipt, RotateCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { historyService } from '@/services/historyService';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await historyService.getCustomerHistory();
        const data = res?.data || [];
        setVisits(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to fetch history', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const completed = visits.filter((v) => v.status === 'seated');
  const totalSpent = completed.reduce((s, v) => s + (v.totalSpent || 0), 0);
  const avgWait =
    completed.length > 0
      ? Math.round(completed.reduce((s, v) => s + (v.waitTime || 0), 0) / completed.length)
      : 0;

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
            <Summary label="Lifetime spend" value={`$${totalSpent.toFixed(2)}`} accent />
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
        ) : visits.length === 0 ? (
          <div className="mt-10 text-center py-16 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">No visits yet. Join a queue to get started!</p>
          </div>
        ) : (
          <ul className="mt-10 space-y-4">
            {visits.map((v) => {
              const isSeated = v.status === 'seated';
              const date = v.seatedAt
                ? new Date(v.seatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';
              const hasOrders = (v.orders || []).length > 0;
              const totalAmount = v.totalSpent || 0;

              return (
                <li
                  key={v.id}
                  className="rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-gold/30 transition"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div
                      className={`sm:w-48 sm:h-auto h-40 relative grid place-items-center ${
                        isSeated ? 'bg-gold/5' : 'bg-destructive/5'
                      }`}
                    >
                      <div
                        className={`h-16 w-16 rounded-full flex items-center justify-center ${
                          isSeated
                            ? 'bg-[oklch(0.7_0.16_145)]/15 text-[oklch(0.7_0.16_145)]'
                            : 'bg-destructive/15 text-destructive'
                        }`}
                      >
                        <MapPin className="h-8 w-8" />
                      </div>
                      {!isSeated && (
                        <div className="absolute inset-0 grid place-items-center">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-destructive/20 text-destructive font-medium">
                            {v.status === 'no_show' ? 'No-show' : 'Left'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-semibold">{v.restaurantName}</h3>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> {date}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> Party of {v.partySize}
                          </span>
                          {isSeated && (
                            <>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" /> Waited {v.waitTime} min
                              </span>
                              {hasOrders && (
                                <span className="inline-flex items-center gap-1">
                                  <Receipt className="h-3.5 w-3.5" /> ${totalAmount.toFixed(2)}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button className="px-3 py-2 rounded-lg border border-border hover:border-gold hover:text-gold text-sm inline-flex items-center gap-1.5">
                          <RotateCw className="h-3.5 w-3.5" /> Book again
                        </button>
                        {isSeated && hasOrders && (
                          <button className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground text-sm">
                            Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
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
