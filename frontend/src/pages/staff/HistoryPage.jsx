import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Search,
  Download,
  ArrowLeft,
  TrendingUp,
  Users,
  Clock,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ownerHistory } from '@/data/ownerHistory';

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const seatedCount = ownerHistory.filter((h) => h.status === 'seated').length;
  const noShowCount = ownerHistory.filter((h) => h.status === 'no-show').length;
  const totalGuests = ownerHistory
    .filter((h) => h.status === 'seated')
    .reduce((s, h) => s + h.size, 0);
  const avgWait = Math.round(
    ownerHistory.reduce((s, h) => s + h.waitedMin, 0) / ownerHistory.length
  );

  const filtered = useMemo(
    () =>
      ownerHistory.filter((h) => {
        const matchesFilter = filter === 'all' || h.status === filter;
        const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    [search, filter]
  );

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
                {['all', 'seated', 'no-show'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs rounded transition capitalize ${filter === f ? 'bg-gold/15 text-gold' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {f.replace('-', ' ')}
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
                  return (
                    <div
                      key={h.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-background/40 transition"
                    >
                      <div
                        className={`h-10 w-10 rounded-full grid place-items-center shrink-0 ${seated ? 'bg-[oklch(0.7_0.16_145)]/15 text-[oklch(0.7_0.16_145)]' : 'bg-destructive/15 text-destructive'}`}
                      >
                        {seated ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{h.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            Party of {h.size}
                          </Badge>
                          {h.preorder && (
                            <Badge className="text-xs bg-gold/15 text-gold border border-gold/30 hover:bg-gold/15">
                              Pre-ordered
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Waited {h.waitedMin}m ·{' '}
                          {h.minutesAgo === 0 ? 'Just now' : `${h.minutesAgo}m ago`}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium uppercase tracking-wider ${seated ? 'text-[oklch(0.7_0.16_145)]' : 'text-destructive'}`}
                      >
                        {seated ? 'Seated' : 'No-show'}
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
