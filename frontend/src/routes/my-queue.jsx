import { Link, useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import {
  Bell,
  MapPin,
  Users,
  Clock,
  X,
  BellRing,
  AlertTriangle,
  ShoppingBag,
  Plus,
  Minus,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { restaurantService } from '@/services/restaurantService';
import { queueService } from '@/services/queueService';
import { ratingService } from '@/services/ratingService';
import { connectSocket } from '@/socket/socketClient';
import { motion, AnimatePresence } from 'framer-motion';
import RatingDialog from '@/components/rating/RatingDialog';

const notificationSound = '/mixkit-correct-answer-tone-2870.wav';

let audioCache = null;
const getNotificationAudio = () => {
  if (!audioCache) {
    audioCache = new Audio(notificationSound);
    audioCache.volume = 0.5;
  }
  audioCache.currentTime = 0;
  return audioCache;
};

const defaultImage =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80';

export default function MyQueuePage() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [queueEntry, setQueueEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reminder, setReminder] = useState(null);
  const [seated, setSeated] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [cart, setCart] = useState({});
  const [hasPreOrder, setHasPreOrder] = useState(false);

  const queueIdRef = useRef(null);

  useEffect(() => {
    if (queueEntry) {
      queueIdRef.current = queueEntry._id;
    }
  }, [queueEntry]);

  useEffect(() => {
    const fetchMyQueue = async () => {
      try {
        const queueRes = await queueService.getMyQueue();
        const queueData = queueRes.data || queueRes;

        if (!queueData || queueData.status !== 'waiting') {
          setLoading(false);
          return;
        }

        setQueueEntry(queueData);

        const existingPreOrders = queueData.preOrders || [];
        if (existingPreOrders.length > 0) {
          setHasPreOrder(true);
        }

        const restId = queueData.restaurant?._id || queueData.restaurant;
        if (restId) {
          const restRes = await restaurantService.getById(restId);
          const restData = restRes.data || restRes;
          setRestaurant(restData);
        }
      } catch (e) {
        console.error('Failed to fetch queue', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMyQueue();
  }, []);

  useEffect(() => {
    if (!queueEntry) return;
    const socket = connectSocket();
    const customerId = String(queueEntry.customer?._id || queueEntry.customer);
    socket.emit('join_customer_room', { customerId });
  }, [queueEntry]);

  useEffect(() => {
    const socket = connectSocket();

    const handleTableReady = (data) => {
      setReminder({
        message: data.message || 'Your table is almost ready! Please be nearby.',
        preOrders: data.preOrders || [],
      });
      getNotificationAudio().play();
    };

    const handleWaitTimeUpdate = (data) => {
      setQueueEntry((prev) => {
        if (!prev || String(data.queueId) !== String(prev._id)) return prev;
        return {
          ...prev,
          estimatedWaitMinutes: data.estimatedWaitMinutes,
          position: data.position,
        };
      });
    };

    const handleSeated = (data) => {
      if (queueIdRef.current && String(data.queueId) === String(queueIdRef.current)) {
        setSeated(true);
        getNotificationAudio().play();
        toast.success('You have been seated! Enjoy your meal.');
      }
    };

    socket.on('table_ready', handleTableReady);
    socket.on('wait_time_update', handleWaitTimeUpdate);
    socket.on('customer_seated', handleSeated);

    return () => {
      socket.off('table_ready', handleTableReady);
      socket.off('wait_time_update', handleWaitTimeUpdate);
      socket.off('customer_seated', handleSeated);
    };
  }, []);

  const add = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  };
  const sub = (id) =>
    setCart((c) => {
      const n = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });

  const menu = restaurant?.menu || [];
  const findMenuItem = (id) => {
    if (!id) return null;
    const prefix = 'menu-';
    if (id.startsWith(prefix)) {
      const idx = parseInt(id.slice(prefix.length), 10);
      if (!isNaN(idx) && idx >= 0 && idx < menu.length) return menu[idx];
    }
    const strId = String(id);
    return menu.find((m, idx) => {
      const mId = String(m._id || m.id || `menu-${idx}`);
      return mId === strId;
    });
  };

  const cartTotal = Object.entries(cart).reduce((sum, [id, q]) => {
    const item = findMenuItem(id);
    const price = Number(item?.price) || 0;
    return sum + price * Number(q);
  }, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleConfirmPreorder = () => {
    if (cartCount === 0 || !queueEntry) return;

    const preOrderItems = Object.entries(cart)
      .map(([id, qty]) => {
        const menuItem = findMenuItem(id);
        if (!menuItem) return null;
        return {
          name: menuItem.name,
          price: menuItem.price,
          category: menuItem.category,
          image: menuItem.image,
          quantity: qty,
        };
      })
      .filter(Boolean);

    const socket = connectSocket();
    socket.emit('preorder_received', {
      queueId: queueEntry._id,
      items: preOrderItems,
      totalAmount: cartTotal,
      customerId: queueEntry.customer?._id || queueEntry.customer,
    });

    toast.success('Pre-order confirmed! The restaurant will start preparing when you arrive.');
    setCart({});
    setHasPreOrder(true);
  };

  const handleLeaveQueue = async () => {
    try {
      await queueService.leaveCustomerQueue();
      toast.success('Left the queue');
      navigate('/restaurants');
    } catch (e) {
      toast.error(e.message || 'Failed to leave queue');
    }
  };

  const handleNotify = () => {
    const socket = connectSocket();
    socket.emit('customer_ready_request', {
      customerId: String(queueEntry.customer?._id || queueEntry.customer),
      queueEntryId: String(queueEntry._id),
    });
    toast.info('Restaurant notified that you are waiting');
  };

  if (loading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-muted-foreground">Loading your queue status...</p>
        </div>
      </PageShell>
    );
  }

  if (!queueEntry || queueEntry.status !== 'waiting') {
    return (
      <PageShell>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground/40" />
          <h2 className="mt-6 text-2xl font-display font-bold">You're not in any queue</h2>
          <p className="mt-2 text-muted-foreground">
            Join a restaurant queue to see your status here.
          </p>
          <Link
            to="/restaurants"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90"
          >
            Browse restaurants
          </Link>
        </section>
      </PageShell>
    );
  }

  const image = restaurant?.image || defaultImage;

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence>
          {reminder && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 rounded-2xl border border-gold/50 bg-gold/10 backdrop-blur-sm shadow-elegant overflow-hidden"
            >
              <div className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                  <BellRing className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Your Seating Is Ready!</p>
                  <p className="text-sm text-foreground">{reminder.message}</p>
                </div>
                <button
                  onClick={() => setReminder(null)}
                  className="text-muted-foreground hover:text-foreground transition flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {reminder.preOrders && reminder.preOrders.length > 0 && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Your pre-order</p>
                  <div className="space-y-1">
                    {reminder.preOrders.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span>
                          {item.name} ×{item.quantity || 1}
                        </span>
                        <span className="font-medium text-gold">
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t border-gold/20">
                      <span className="text-xs font-semibold">Total</span>
                      <span className="font-bold text-gold">
                        $
                        {reminder.preOrders
                          .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-gold/20 bg-card overflow-hidden">
              <div className="relative h-48 sm:h-56">
                <img src={image} alt={restaurant?.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.16_145)] animate-pulse" />{' '}
                    Live queue
                  </span>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-display font-bold">
                    {restaurant?.name}
                  </h1>
                  <p className="text-sm text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {restaurant?.address} · {restaurant?.cuisine}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <Stat icon={Users} label="Position" value={`#${queueEntry.position || 1}`} />
                  <Stat
                    icon={Clock}
                    label="ETA"
                    value={`${queueEntry.estimatedWaitMinutes || 0} min`}
                    accent
                  />
                  <Stat icon={Bell} label="Party of" value={queueEntry.partySize || 1} />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={handleNotify}
                    className="px-4 py-2.5 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 text-sm"
                  >
                    Notify me when ready
                  </button>
                  <button
                    onClick={handleLeaveQueue}
                    className="px-4 py-2.5 rounded-lg border border-border hover:border-destructive/40 hover:text-destructive text-sm inline-flex items-center gap-1.5"
                  >
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

              <ul className="mt-6 space-y-3">
                {menu.map((m, idx) => {
                  const itemId = `menu-${idx}`;
                  const qty = cart[itemId] ?? 0;
                  return (
                    <li
                      key={itemId}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-surface/30 hover:border-gold/30 transition-all"
                    >
                      {m.image ? (
                        <img
                          src={m.image}
                          alt={m.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 text-muted-foreground/40 text-xl">
                          🍽
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm">{m.name}</p>
                        {m.description && (
                          <p className="text-xs text-muted-foreground truncate">{m.description}</p>
                        )}
                        <p className="text-sm text-gold font-semibold">${m.price.toFixed(2)}</p>
                      </div>
                      {qty === 0 ? (
                        <button
                          onClick={() => add(itemId)}
                          className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-border hover:border-gold hover:text-gold text-sm inline-flex items-center gap-1 transition"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add
                        </button>
                      ) : (
                        <div className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/5 px-1">
                          <button
                            onClick={() => sub(itemId)}
                            className="p-1.5 hover:text-gold transition"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-sm font-medium w-5 text-center">{qty}</span>
                          <button
                            onClick={() => add(itemId)}
                            className="p-1.5 hover:text-gold transition"
                          >
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
                {cartCount > 0 && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold font-medium">
                    {cartCount} item{cartCount > 1 ? 's' : ''}
                  </span>
                )}
              </h3>

              {cartCount === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  No items yet. Add dishes from the menu to skip the kitchen wait.
                </p>
              ) : (
                <ul className="mt-4 space-y-2 text-sm">
                  {Object.entries(cart).map(([id, q]) => {
                    const menuItem = findMenuItem(id);
                    return (
                      <li key={id} className="flex justify-between gap-2">
                        <span className="text-muted-foreground truncate">
                          {q}× {menuItem?.name}
                        </span>
                        <span className="font-medium">
                          ${((menuItem?.price || 0) * q).toFixed(2)}
                        </span>
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
                onClick={handleConfirmPreorder}
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

        <AnimatePresence>
          {seated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="mx-4 max-w-md w-full rounded-3xl border border-gold/30 bg-card p-8 text-center shadow-elegant"
              >
                <div className="h-16 w-16 mx-auto rounded-full gradient-gold flex items-center justify-center mb-5">
                  <BellRing className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-display font-bold">You're Seated!</h2>
                <p className="mt-2 text-muted-foreground">
                  Thanks for choosing us today. Enjoy your meal at{' '}
                  <span className="text-foreground font-medium">{restaurant?.name}</span>.
                </p>
                <button
                  onClick={() => {
                    setSeated(false);
                    setShowRatingDialog(true);
                  }}
                  className="mt-6 w-full px-4 py-2.5 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90"
                >
                  Rate your experience
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRatingDialog && (
            <RatingDialog
              restaurantName={restaurant?.name}
              restaurantId={restaurant?.id}
              onSubmit={async (restaurantId, score) => {
                try {
                  await ratingService.submitRating({ restaurantId, score });
                  toast.success('Thank you for your rating!');
                } catch (e) {
                  toast.error(e.message || 'Failed to submit rating');
                } finally {
                  setShowRatingDialog(false);
                  navigate('/restaurants');
                }
              }}
              onSkip={() => {
                setShowRatingDialog(false);
                navigate('/restaurants');
              }}
            />
          )}
        </AnimatePresence>
      </section>
    </PageShell>
  );
}

function Stat({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-xl bg-surface/50 p-4">
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className={`text-2xl font-display font-bold ${accent ? 'gradient-text-gold' : ''}`}>
        {value}
      </p>
    </div>
  );
}
