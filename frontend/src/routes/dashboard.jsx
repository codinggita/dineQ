import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  Plus,
  Minus,
  TrendingUp,
  History as HistoryIcon,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { waitTone } from '@/data/restaurants';
import { ownerHistory } from '@/data/ownerHistory';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [parties, setParties] = useState([
    {
      id: 'p1',
      name: 'Anderson',
      size: 2,
      phone: '+1 555-0142',
      joinedAt: 38,
      status: 'notified',
      preorder: true,
    },
    {
      id: 'p2',
      name: 'Chen',
      size: 4,
      phone: '+1 555-0188',
      joinedAt: 31,
      status: 'waiting',
      notes: 'Window seat',
    },
    { id: 'p3', name: 'Okafor', size: 3, phone: '+1 555-0123', joinedAt: 24, status: 'waiting' },
    {
      id: 'p4',
      name: 'Rivera',
      size: 2,
      phone: '+1 555-0167',
      joinedAt: 18,
      status: 'waiting',
      preorder: true,
    },
    {
      id: 'p5',
      name: 'Patel',
      size: 6,
      phone: '+1 555-0199',
      joinedAt: 12,
      status: 'waiting',
      notes: 'Birthday',
    },
    { id: 'p6', name: 'Müller', size: 2, phone: '+1 555-0111', joinedAt: 6, status: 'waiting' },
  ]);
  const [waitPerParty, setWaitPerParty] = useState(8);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newSize, setNewSize] = useState(2);
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const active = useMemo(
    () => parties.filter((p) => p.status === 'waiting' || p.status === 'notified'),
    [parties]
  );
  const filtered = useMemo(
    () =>
      active.filter(
        (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
      ),
    [active, search]
  );

  const seatedToday =
    ownerHistory.filter((h) => h.status === 'seated').length +
    parties.filter((p) => p.status === 'seated').length;
  const noShows =
    ownerHistory.filter((h) => h.status === 'no-show').length +
    parties.filter((p) => p.status === 'no-show').length;
  const guestsWaiting = active.reduce((sum, p) => sum + p.size, 0);
  const avgWait = active.length > 0 ? Math.round((active.length * waitPerParty) / 2) : 0;

  function updateStatus(id, status) {
    setParties((prev) => {
      const party = prev.find((p) => p.id === id);
      if (party && (status === 'seated' || status === 'no-show')) {
        return prev.filter((p) => p.id !== id);
      }
      return prev.map((p) => (p.id === id ? { ...p, status } : p));
    });
  }

  function moveParty(id, dir) {
    setParties((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function addParty(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setParties((prev) => [
      ...prev,
      {
        id: `p${Date.now()}`,
        name: newName.trim(),
        size: newSize,
        phone: newPhone || '—',
        joinedAt: 0,
        status: 'waiting',
      },
    ]);
    setNewName('');
    setNewSize(2);
    setNewPhone('');
  }

  const tone = waitTone(avgWait);

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8"
        >
          <div>
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-xs text-gold mb-3"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-gold"
              />
              Live · Ember &amp; Oak
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="font-display text-3xl md:text-4xl font-semibold tracking-tight"
            >
              Owner Dashboard
            </motion.h1>
            <p className="text-muted-foreground mt-1">
              Manage your live queue, seat parties, and adjust wait estimates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-border" asChild>
              <Link to="/owner-history">
                <HistoryIcon className="h-4 w-4" /> Service history
              </Link>
            </Button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold flex items-center gap-2"
            >
              <Bell className="h-4 w-4" /> Broadcast update
            </motion.button>
          </div>
        </motion.div>

        {loading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl border border-border/60 bg-card p-5 space-y-2"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-12" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: Users, label: 'Parties waiting', value: active.length },
              { icon: TrendingUp, label: 'Guests in queue', value: guestsWaiting },
              { icon: Clock, label: 'Avg. wait', value: `${avgWait}m`, accent: tone.color },
              { icon: CheckCircle2, label: 'Seated today', value: seatedToday },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                className="rounded-2xl border border-border/60 bg-card p-5"
              >
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                  {stat.icon && <stat.icon className="h-4 w-4" />}
                  {stat.label}
                </div>
                <div className={`font-display text-3xl font-semibold mt-2 ${stat.accent ?? ''}`}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card/60 border-border/60">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display">Live queue</CardTitle>
                  {loading ? (
                    <Skeleton className="h-4 w-24 mt-1" />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {active.length} active · {noShows} no-shows
                    </p>
                  )}
                </div>
                <div className="relative w-56">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or phone"
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border/60 bg-background/40 p-4 space-y-3"
                    >
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  ))
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filtered.map((party, idx) => (
                      <motion.div
                        key={party.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.01 }}
                        className="rounded-lg border border-border/60 bg-background/40 p-4 hover:border-gold/40 transition"
                      >
                        <div className="flex items-start gap-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="h-10 w-10 rounded-md gradient-gold grid place-items-center text-primary-foreground font-display font-semibold shrink-0"
                          >
                            {idx + 1}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{party.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                Party of {party.size}
                              </Badge>
                              {party.preorder && (
                                <Badge className="text-xs bg-gold/15 text-gold border border-gold/30">
                                  Pre-ordered
                                </Badge>
                              )}
                              {party.status === 'notified' && (
                                <Badge className="text-xs bg-secondary text-foreground">
                                  Notified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>Phone: {party.phone}</span>
                              <span>
                                Waiting {party.joinedAt}m · ETA {(idx + 1) * waitPerParty}m
                              </span>
                            </div>
                            {party.notes && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                Note: {party.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => moveParty(party.id, -1)}
                            >
                              <Minus className="h-4 w-4 rotate-90" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => moveParty(party.id, 1)}
                            >
                              <Plus className="h-4 w-4 rotate-90" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {party.status !== 'notified' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(party.id, 'notified')}
                            >
                              <Bell className="h-3.5 w-3.5" /> Notify
                            </Button>
                          )}
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(party.id, 'seated')}
                            className="px-3 py-1.5 rounded-lg gradient-gold text-primary-foreground text-sm flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Seat now
                          </motion.button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => updateStatus(party.id, 'no-show')}
                          >
                            <XCircle className="h-3.5 w-3.5" /> No-show
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border/60 bg-card p-6"
            >
              <h3 className="font-display text-lg font-semibold mb-4">Wait estimate</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Per party</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setWaitPerParty((v) => Math.max(2, v - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-display text-2xl w-12 text-center text-gold">
                    {waitPerParty}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setWaitPerParty((v) => Math.min(30, v + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-md border border-border/60 bg-background/40 p-3 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current avg.</span>
                  <span className={`font-medium ${tone.color}`}>
                    {avgWait} min · {tone.label}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Push update to guests
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border/60 bg-card p-6"
            >
              <h3 className="font-display text-lg font-semibold mb-2">Add walk-in</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manually add a party to the queue.
              </p>
              <form onSubmit={addParty} className="space-y-3">
                <Input
                  placeholder="Guest name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  placeholder="Phone (optional)"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
                <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
                  <span className="text-sm text-muted-foreground">Party size</span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setNewSize((v) => Math.max(1, v - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium w-6 text-center">{newSize}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setNewSize((v) => Math.min(20, v + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-4 py-2.5 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add to queue
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </PageShell>
  );
}
