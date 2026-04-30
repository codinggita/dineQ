import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle2,
  XCircle,
  Search,
  Download,
  ArrowLeft,
  TrendingUp,
  Users,
  Clock,
  ShoppingBag,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { historyService } from '@/services/historyService';
import { connectSocket } from '@/socket/socketClient';
import { restaurantService } from '@/services/restaurantService';

export default function OwnerHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [restaurantId, setRestaurantId] = useState(null);
  const hasFetchedRef = useRef(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await historyService.getRestaurantHistory();
      const data = res?.data || [];
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch history', e);
    } finally {
      setLoading(false);
      hasFetchedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const restaurantRes = await restaurantService.getMyRestaurant();
        const restData = restaurantRes.data || restaurantRes;
        const restId = restData.id;
        setRestaurantId(restId);
      } catch (e) {
        console.error('Failed to fetch restaurant', e);
      }
    };
    init();
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (!restaurantId) return;

    const socket = connectSocket();
    socket.emit('join_restaurant_room', { restaurantId });

    const onHistoryUpdated = () => {
      if (hasFetchedRef.current) {
        fetchHistory();
      }
    };

    socket.on('history_updated', onHistoryUpdated);

    return () => {
      socket.off('history_updated', onHistoryUpdated);
    };
  }, [restaurantId, fetchHistory]);

  const seatedCount = history.filter((h) => h.status === 'seated').length;
  const noShowCount = history.filter((h) => h.status === 'no_show' || h.status === 'left').length;
  const totalGuests = history
    .filter((h) => h.status === 'seated')
    .reduce((s, h) => s + (h.partySize || 0), 0);
  const avgWait =
    history.length > 0
      ? Math.round(history.reduce((s, h) => s + (h.waitTime || 0), 0) / history.length)
      : 0;

  const filtered = useMemo(
    () =>
      history.filter((h) => {
        const matchesFilter = filter === 'all' || h.status === filter;
        const name = h.customerName || h.name || '';
        const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [search, filter, history]
  );

  if (loading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition mb-3"
            >
              <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Service history
            </h1>
            <p className="text-muted-foreground mt-1">
              Every party seated and no-show from today's service.
            </p>
          </div>
          <Button variant="outline" className="border-border w-fit">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Stat
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Parties seated"
            value={seatedCount}
          />
          <Stat icon={<Users className="h-4 w-4" />} label="Total guests" value={totalGuests} />
          <Stat icon={<Clock className="h-4 w-4" />} label="Avg. wait" value={`${avgWait}m`} />
          <Stat icon={<TrendingUp className="h-4 w-4" />} label="No-shows" value={noShowCount} />
        </div>

        <Card className="bg-card/60 border-border/60">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border/60">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search guest name"
                  className="pl-9"
                />
              </div>
              <div className="flex gap-1 rounded-md border border-border/60 p-1 bg-background/40">
                {['all', 'seated', 'no_show', 'left'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs rounded transition capitalize ${
                      filter === f
                        ? 'bg-gold/15 text-gold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f === 'no_show' ? 'no-show' : f.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                No matching records.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {filtered.map((h) => {
                  const seated = h.status === 'seated';
                  const timeAgo = h.seatedAt
                    ? Math.round((Date.now() - new Date(h.seatedAt).getTime()) / 60000)
                    : 0;
                  const hasPreOrders = (h.preOrders || []).length > 0;
                  const hasOrders = (h.orders || []).length > 0;

                  return (
                    <div
                      key={h.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-background/40 transition"
                    >
                      <div
                        className={`h-10 w-10 rounded-full grid place-items-center shrink-0 ${
                          seated
                            ? 'bg-[oklch(0.7_0.16_145)]/15 text-[oklch(0.7_0.16_145)]'
                            : 'bg-destructive/15 text-destructive'
                        }`}
                      >
                        {seated ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{h.customerName || h.name || 'Guest'}</span>
                          <Badge variant="secondary" className="text-xs">
                            Party of {h.partySize}
                          </Badge>
                          {hasPreOrders && (
                            <Badge className="text-xs bg-gold/15 text-gold border border-gold/30 hover:bg-gold/15">
                              <ShoppingBag className="h-3 w-3 mr-1" />
                              {h.preOrders.length} pre-order
                              {h.preOrders.length > 1 ? 's' : ''}
                            </Badge>
                          )}
                          {hasOrders && (
                            <Badge className="text-xs bg-green-500/15 text-green-500 border border-green-500/30 hover:bg-green-500/15">
                              {h.orders.length} order
                              {h.orders.length > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Waited {h.waitTime}m · {timeAgo === 0 ? 'Just now' : `${timeAgo}m ago`}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium uppercase tracking-wider ${
                          seated ? 'text-[oklch(0.7_0.16_145)]' : 'text-destructive'
                        }`}
                      >
                        {seated ? 'Seated' : h.status === 'no_show' ? 'No-show' : 'Left'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function Stat({ icon, label, value }) {
  return (
    <Card className="bg-card/60 border-border/60">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
          {icon}
          {label}
        </div>
        <div className="font-display text-3xl font-semibold mt-2">{value}</div>
      </CardContent>
    </Card>
  );
}
