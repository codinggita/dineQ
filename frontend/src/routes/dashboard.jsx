import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  BellRing,
  Plus,
  Minus,
  TrendingUp,
  History as HistoryIcon,
  Utensils,
  Save,
  Trash2,
  ChefHat,
  X,
  ShoppingBag,
  Settings,
  ArrowLeft,
  UsersRound,
  MapPin,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { restaurantService } from '@/services/restaurantService';
import { queueService } from '@/services/queueService';
import { connectSocket } from '@/socket/socketClient';
import JoinNotification from '@/components/queue/JoinNotification';

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

const waitTone = (minutes) => {
  if (minutes <= 10) return { color: 'text-green-500', dot: 'bg-green-500', label: 'Low' };
  if (minutes <= 20) return { color: 'text-yellow-500', dot: 'bg-yellow-500', label: 'Moderate' };
  return { color: 'text-red-500', dot: 'bg-red-500', label: 'High' };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const mockParties = [
  {
    id: '1',
    name: 'John D.',
    partySize: 4,
    position: 1,
    waitTime: 12,
    status: 'waiting',
    preOrders: [],
    notes: '',
  },
  {
    id: '2',
    name: 'Sarah M.',
    partySize: 2,
    position: 2,
    waitTime: 18,
    status: 'waiting',
    preOrders: [{ name: 'Caesar Salad', price: 12 }],
    notes: 'Window seat please',
  },
  {
    id: '3',
    name: 'Mike R.',
    partySize: 6,
    position: 3,
    waitTime: 25,
    status: 'ready',
    preOrders: [],
    notes: '',
  },
  {
    id: '4',
    name: 'Emily W.',
    partySize: 3,
    position: 4,
    waitTime: 30,
    status: 'waiting',
    preOrders: [
      { name: 'Ribeye', price: 45 },
      { name: 'Wine', price: 12 },
    ],
    notes: '',
  },
];

const mockMenu = [
  { id: '1', name: 'Ribeye Steak', price: 45, category: 'Main', description: '12oz prime ribeye' },
  {
    id: '2',
    name: 'Caesar Salad',
    price: 12,
    category: 'Appetizer',
    description: 'Romaine, parmesan, croutons',
  },
  {
    id: '3',
    name: 'Grilled Salmon',
    price: 32,
    category: 'Main',
    description: 'Atlantic salmon with herbs',
  },
  {
    id: '4',
    name: 'Garlic Bread',
    price: 8,
    category: 'Appetizer',
    description: 'Toasted with garlic butter',
  },
  {
    id: '5',
    name: 'Tiramisu',
    price: 10,
    category: 'Dessert',
    description: 'Classic Italian dessert',
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queue');
  const [restaurant, setRestaurant] = useState({
    id: '1',
    name: 'The Golden Fork',
    address: '123 Main Street',
    cuisine: 'American',
    avgWaitTime: 15,
    isOpen: true,
    ownerId: 'owner1',
  });
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main',
    image: '',
  });
  const [parties, setParties] = useState(mockParties);
  const [menuError, setMenuError] = useState('');
  const [menuSaving, setMenuSaving] = useState(false);
  const [waitPerParty, setWaitPerParty] = useState(8);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newSize, setNewSize] = useState(2);
  const [newPhone, setNewPhone] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [expandedPreorder, setExpandedPreorder] = useState(null);
  const [reminderSending, setReminderSending] = useState({});
  const [showAddParty, setShowAddParty] = useState(false);
  const [addPartyError, setAddPartyError] = useState('');
  const [selectedParty, setSelectedParty] = useState(null);

  // New state for join notifications
  const [newJoins, setNewJoins] = useState([]);
  const [prevQueue, setPrevQueue] = useState(null);
  const prevQueueRef = useRef(null);
  const [pendingToast, setPendingToast] = useState({ count: 0, visible: false });
  const [pendingJoins, setPendingJoins] = useState([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const pendingToastTimer = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantRes = await restaurantService.getMyRestaurant();
        const restData = restaurantRes.data || restaurantRes;
        const restId = restData.id;

        setRestaurant(restData);
        setRestaurantId(restId);
        setMenuItems(restData.menu || []);
        setWaitPerParty(restData.avgSeatingTimeMinutes || 15);

        if (restId) {
          const queueRes = await queueService.getByRestaurant(restId);
          const queueList = queueRes.data?.data || queueRes.data || [];
          const formattedParties = queueList.map((q, idx) => ({
            id: q._id || q.id,
            name: q.customer?.name || 'Guest',
            partySize: q.partySize,
            position: q.position || idx + 1,
            waitTime: q.estimatedWaitMinutes || (idx + 1) * waitPerParty,
            status: q.status || 'waiting',
            preOrders: q.preOrders || [],
            notes: q.notes || '',
          }));
          setParties(formattedParties);

          // Initialize prevQueue to prevent false new-join detection
          const queueData = formattedParties.map((p) => ({
            id: p.id,
            customer: { name: p.name },
            partySize: p.partySize,
            position: p.position,
            estimatedWaitMinutes: p.waitTime,
            status: p.status,
            preOrders: p.preOrders,
            notes: p.notes,
          }));
          setPrevQueue(queueData);
          prevQueueRef.current = queueData;
          setInitialLoadComplete(true);
        }
      } catch (e) {
        console.error('Failed to fetch data', e);
        // initialLoadComplete stays false, events ignored until success
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [waitPerParty]);

  useEffect(() => {
    if (!restaurantId) return;
    const socket = connectSocket();
    socket.emit('join_restaurant_room', { restaurantId });

    const setPendingToastTimer = () => {
      if (pendingToastTimer.current) clearTimeout(pendingToastTimer.current);
      pendingToastTimer.current = setTimeout(() => {
        setPendingToast({ count: 0, visible: false });
      }, 10000);
    };

    const handleQueueUpdate = (data) => {
      const queueData = data.queue || [];
      if (!Array.isArray(queueData)) return;
      if (!initialLoadComplete) return;

      const formattedParties = queueData.map((q, idx) => ({
        id: q._id || q.id,
        name: q.customer?.name || q.customerName || 'Guest',
        partySize: q.partySize,
        position: q.position || idx + 1,
        waitTime: q.estimatedWaitMinutes || (idx + 1) * waitPerParty,
        status: 'waiting',
        preOrders: q.preOrders || [],
        notes: q.notes || '',
      }));
      setParties(formattedParties);

      const prevFormatted = queueData.map((q, idx) => ({
        id: q.id || q._id,
        customer: q.customer || { name: q.customerName || 'Guest' },
        partySize: q.partySize,
        position: q.position || idx + 1,
        estimatedWaitMinutes: q.estimatedWaitMinutes,
        status: q.status || 'waiting',
        preOrders: q.preOrders || [],
        notes: q.notes || '',
      }));
      setPrevQueue(prevFormatted);
      prevQueueRef.current = prevFormatted;
    };

    socket.on('queue_updated', handleQueueUpdate);

    const handleCustomerJoined = (data) => {
      getNotificationAudio().play();
      if (!initialLoadComplete) return;
      const newJoin = {
        id: data.id,
        customer: { name: data.customerName || 'Guest' },
        partySize: data.partySize,
        position: data.position,
        estimatedWaitMinutes: data.estimatedWaitMinutes,
        preOrders: data.preOrders || [],
        notes: data.notes || '',
        timestamp: Date.now(),
        totalPrice: (data.preOrders || []).reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
          0
        ),
      };
      setNewJoins((prev) => {
        if (prev.some((j) => j.id === newJoin.id)) return prev;
        return [...prev, newJoin];
      });
    };

    socket.on('customer_joined', handleCustomerJoined);

    const handlePreorderReceived = (data) => {
      getNotificationAudio().play();
      if (!initialLoadComplete) return;
      const newJoin = {
        id: data.queueId,
        customer: { name: data.customerName || 'Guest' },
        partySize: data.partySize,
        position: data.position,
        estimatedWaitMinutes: data.estimatedWaitMinutes,
        preOrders: data.items || [],
        notes: '',
        timestamp: Date.now(),
        totalPrice: data.totalAmount,
      };
      setNewJoins((prev) => {
        if (prev.some((j) => j.id === newJoin.id)) return prev;
        return [...prev, newJoin];
      });
    };

    socket.on('preorder_received', handlePreorderReceived);

    const handleWaitTimeUpdate = (data) => {
      if (!initialLoadComplete) return;
      if (data.queue && Array.isArray(data.queue)) {
        setParties((prev) =>
          prev.map((p) => {
            const update = data.queue.find((q) => q.id === p.id);
            if (update) {
              return { ...p, waitTime: update.estimatedWaitMinutes };
            }
            return p;
          })
        );
      }
    };

    socket.on('wait_time_update', handleWaitTimeUpdate);

    socket.on('customer_ready_request', (data) => {
      getNotificationAudio().play();
      toast.info(`${data.customerName} wants to be notified`, {
        description: 'They are waiting for their table',
      });
    });

    socket.on('customer_seated', (data) => {
      setParties((prev) =>
        prev.map((p) =>
          p.id === data.queueId
            ? { ...p, status: 'seated', position: data.position || p.position }
            : p
        )
      );
    });

    return () => {
      socket.off('queue_updated', handleQueueUpdate);
      socket.off('customer_joined', handleCustomerJoined);
      socket.off('preorder_received', handlePreorderReceived);
      socket.off('wait_time_update', handleWaitTimeUpdate);
      socket.off('customer_ready_request');
      socket.off('customer_seated');
      if (pendingToastTimer.current) clearTimeout(pendingToastTimer.current);
    };
  }, [restaurantId, waitPerParty, initialLoadComplete]);

  const filteredParties = useMemo(() => {
    return parties
      .filter((p) => p.status === 'waiting' || p.status === 'ready')
      .sort((a, b) => a.position - b.position);
  }, [parties]);

  const seatedToday = useMemo(() => {
    return parties.filter((p) => p.status === 'seated').length;
  }, [parties]);

  const totalPartiesWait = filteredParties.length;
  const avgWait = filteredParties.length
    ? Math.round(filteredParties.reduce((sum, p) => sum + p.waitTime, 0) / filteredParties.length)
    : 0;

  const handleNotify = useCallback(async (party) => {
    const partyId = party.id || party._id;
    setReminderSending((prev) => ({ ...prev, [partyId]: true }));
    try {
      const socket = connectSocket();
      socket.emit('notify_customer', {
        customerId: partyId,
        queueEntryId: partyId,
      });
      setTimeout(() => {
        setReminderSending((prev) => ({ ...prev, [partyId]: false }));
      }, 1000);
    } catch (e) {
      setReminderSending((prev) => ({ ...prev, [partyId]: false }));
    }
  }, []);

  const handleSeat = useCallback(async (partyId) => {
    try {
      await queueService.seatCustomer(partyId);
      setParties((prev) => prev.filter((p) => p.id !== partyId));
      toast.success('Customer seated successfully');
    } catch (e) {
      console.error('Failed to seat customer', e);
      toast.error(e.message || 'Failed to seat customer');
    }
  }, []);

  const handleRemove = useCallback(
    async (party) => {
      try {
        const partyId = party.id || party._id;
        console.log('Removing party with ID:', partyId);
        const res = await queueService.removeByOwner(partyId, restaurantId);
        console.log('Remove response:', res);
        setParties((prev) => prev.filter((p) => p.id !== partyId));
        toast.success('Party removed from queue');
      } catch (e) {
        console.error('Failed to remove party', e);
        toast.error(e.message || 'Failed to remove party');
      }
    },
    [restaurantId]
  );

  const handleDismissJoin = useCallback((joinId) => {
    setNewJoins((prev) => prev.filter((j) => j.id !== joinId));
  }, []);

  const handleViewDetails = useCallback((join) => {
    // Transform join object to match selectedParty shape expected by detail modal
    const transformed = {
      ...join,
      name: join.customer?.name || 'Guest',
      waitTime: join.estimatedWaitMinutes ?? 'N/A',
      preOrders: join.preOrders || [],
      notes: join.notes || '',
    };
    setSelectedParty(transformed);
  }, []);

  const handleAddParty = useCallback(() => {
    if (!newName.trim() || !newSize) {
      setAddPartyError('Please enter name and party size');
      return;
    }
    const newParty = {
      id: Date.now().toString(),
      name: newName.trim(),
      partySize: Number(newSize),
      position: filteredParties.length + 1,
      waitTime: (filteredParties.length + 1) * waitPerParty,
      status: 'waiting',
      preOrders: [],
      notes: '',
    };
    setParties((prev) => [...prev, newParty]);
    setNewName('');
    setNewSize(2);
    setShowAddParty(false);
    setAddPartyError('');
  }, [newName, newSize, filteredParties.length, waitPerParty]);

  const filteredMenuItems = useMemo(() => {
    if (!search) return menuItems;
    return menuItems.filter(
      (m) =>
        (m.name && m.name.toLowerCase().includes(search.toLowerCase())) ||
        (m.category && m.category.toLowerCase().includes(search.toLowerCase()))
    );
  }, [menuItems, search]);

  const handleSaveMenuItem = useCallback(async () => {
    if (!newMenuItem.name.trim() || !newMenuItem.price) {
      setMenuError('Please enter name and price');
      return;
    }
    setMenuSaving(true);
    setMenuError('');
    try {
      const newItem = {
        name: newMenuItem.name.trim(),
        description: newMenuItem.description,
        price: parseFloat(newMenuItem.price),
        category: newMenuItem.category,
        image: newMenuItem.image,
        isAvailable: true,
      };
      const updatedMenu = [...menuItems, newItem];
      await restaurantService.update(restaurantId, { menu: updatedMenu });
      setMenuItems(updatedMenu);
      setNewMenuItem({ name: '', description: '', price: '', category: 'Main', image: '' });
    } catch (e) {
      setMenuError(e.message || 'Failed to save');
    } finally {
      setMenuSaving(false);
    }
  }, [newMenuItem, menuItems, restaurantId]);

  const handleDeleteMenuItem = useCallback(
    async (itemName) => {
      try {
        const updatedMenu = menuItems.filter((m) => m.name !== itemName);
        await restaurantService.update(restaurantId, { menu: updatedMenu });
        setMenuItems(updatedMenu);
      } catch (e) {
        setMenuError(e.message || 'Failed to delete');
      }
    },
    [menuItems, restaurantId]
  );

  if (loading) {
    return (
      <PageShell>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-24 bg-surface rounded-2xl" />
            <div className="grid md:grid-cols-3 gap-6">
              <div className="h-32 bg-surface rounded-2xl" />
              <div className="h-32 bg-surface rounded-2xl" />
              <div className="h-32 bg-surface rounded-2xl" />
            </div>
            <div className="h-96 bg-surface rounded-2xl" />
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">{restaurant?.name}</h1>
            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              {restaurant?.address} · {restaurant?.cuisine}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                restaurant?.isOpen
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  restaurant?.isOpen ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              {restaurant?.isOpen ? 'Open' : 'Closed'}
            </span>
            <Link
              to="/restaurants"
              className="px-3 py-1.5 rounded-lg border border-border hover:border-gold/40 hover:text-gold text-sm transition"
            >
              View Restaurant
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-card border-gold/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center">
                    <UsersRound className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Queue</p>
                    <p className="text-2xl font-display font-bold">{totalPartiesWait}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border/60">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-surface flex items-center justify-center">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Wait</p>
                    <p className="text-2xl font-display font-bold">
                      {avgWait}
                      <span className="text-sm font-normal text-muted-foreground ml-1">min</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border/60">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-surface flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Seated Today</p>
                    <p className="text-2xl font-display font-bold">{seatedToday + 3}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="border-b border-border/60 mb-6">
          <nav className="flex gap-6 -mb-px">
            {[
              { id: 'queue', label: 'Queue', icon: Users },
              { id: 'menu', label: 'Menu', icon: Utensils },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'border-gold text-gold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <AnimatePresence>
          <div
            style={{
              position: 'fixed',
              top: '16px',
              right: '16px',
              zIndex: 100,
            }}
            className="space-y-3"
          >
            {newJoins.map((join) => (
              <JoinNotification
                key={join.id}
                join={join}
                onDismiss={() => handleDismissJoin(join.id)}
                onViewDetails={() => handleViewDetails(join)}
              />
            ))}
          </div>
        </AnimatePresence>

        {pendingToast.visible && (
          <div
            style={{
              position: 'fixed',
              top: `${16 + newJoins.length * 92}px`,
              right: '16px',
              zIndex: 101,
            }}
            className="bg-card border border-border rounded-xl p-3 shadow-lg"
          >
            <p className="text-sm">{pendingToast.count} more joins pending</p>
            <button
              onClick={() => {
                setActiveTab('queue');
                setPendingToast({ count: 0, visible: false });
                if (pendingToastTimer.current) clearTimeout(pendingToastTimer.current);
              }}
              className="text-sm text-gold cursor-pointer hover:underline"
            >
              View Queue
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'queue' && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="bg-card border-border/60 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-gold" />
                    Active Queue
                  </CardTitle>
                  <Button
                    onClick={() => setShowAddParty(true)}
                    size="sm"
                    className="gradient-gold text-primary-foreground shadow-gold"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Party
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredParties.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium text-foreground">No parties waiting</p>
                      <p className="text-sm mt-1">Add a party to get started</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/60">
                      {filteredParties.map((party, index) => (
                        <motion.div
                          key={party.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 sm:p-6 flex items-center gap-4 hover:bg-surface/30 transition"
                        >
                          <div className="hidden sm:flex h-10 w-10 rounded-full bg-surface items-center justify-center font-display font-bold text-lg">
                            {party.position}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => setSelectedParty(party)}
                                className="font-medium hover:text-gold transition text-left"
                              >
                                {party.name}
                              </button>
                              <Badge variant="secondary" className="text-xs">
                                Party of {party.partySize}
                              </Badge>
                              {party.status === 'ready' && (
                                <Badge className="bg-gold/20 text-gold border-gold/30">Ready</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                              <Clock className="h-3.5 w-3.5" />
                              {party.waitTime} min wait
                              {party.preOrders && party.preOrders.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <ShoppingBag className="h-3.5 w-3.5" />
                                  {party.preOrders.length} item
                                  {party.preOrders.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </p>
                            {party.notes && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                Note: {party.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSeat(party.id)}
                              className="gradient-gold text-primary-foreground shadow-gold"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Seat
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleNotify(party)}
                              disabled={reminderSending[party.id]}
                            >
                              <Bell className="h-4 w-4 mr-1" />
                              {reminderSending[party.id] ? 'Sent' : 'Notify'}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemove(party)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border/60">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-gold" />
                      Menu Items
                    </CardTitle>
                    <Input
                      placeholder="Search menu..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="max-w-sm mt-2"
                    />
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/60 max-h-[500px] overflow-y-auto">
                      {filteredMenuItems.map((item) => (
                        <div key={item.name || index} className="p-4 flex items-center gap-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 text-muted-foreground/40 text-xl">
                              🍽
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-gold">${item.price.toFixed(2)}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteMenuItem(item.name)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border/60">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Plus className="h-5 w-5 text-gold" />
                      Add Item
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Dish name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        value={newMenuItem.description}
                        onChange={(e) =>
                          setNewMenuItem((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Brief description"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Price ($)</label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={newMenuItem.price}
                          onChange={(e) => setNewMenuItem((p) => ({ ...p, price: e.target.value }))}
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <select
                          value={newMenuItem.category}
                          onChange={(e) =>
                            setNewMenuItem((p) => ({
                              ...p,
                              category: e.target.value,
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 rounded-lg border border-border/60 bg-surface/50 text-sm"
                        >
                          <option value="Main">Main</option>
                          <option value="Appetizer">Appetizer</option>
                          <option value="Dessert">Dessert</option>
                          <option value="Drink">Drink</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Image URL (optional)</label>
                      <Input
                        value={newMenuItem.image}
                        onChange={(e) =>
                          setNewMenuItem((p) => ({
                            ...p,
                            image: e.target.value,
                          }))
                        }
                        placeholder="https://example.com/dish-image.jpg"
                        className="mt-1"
                      />
                    </div>
                    {menuError && <p className="text-sm text-red-500">{menuError}</p>}
                    <Button
                      onClick={handleSaveMenuItem}
                      disabled={menuSaving}
                      className="w-full gradient-gold text-primary-foreground shadow-gold"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {menuSaving ? 'Saving...' : 'Save Item'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="bg-card border-border/60 max-w-xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gold" />
                    Queue Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">Avg Wait Time Per Party</label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Estimated minutes added per party in queue
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setWaitPerParty((w) => Math.max(1, w - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-display font-bold w-16 text-center">
                        {waitPerParty}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setWaitPerParty((w) => w + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <span className="text-muted-foreground text-sm">min</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Accepting New Parties</p>
                        <p className="text-sm text-muted-foreground">
                          Allow new customers to join the queue
                        </p>
                      </div>
                      <button
                        onClick={() => setRestaurant((r) => ({ ...r, isOpen: !r.isOpen }))}
                        className={`relative w-12 h-6 rounded-full transition ${
                          restaurant?.isOpen ? 'bg-gold' : 'bg-surface'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
                            restaurant?.isOpen ? 'left-7' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedParty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg rounded-2xl border border-border/60 bg-card p-6 shadow-elegant"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-display font-semibold">{selectedParty.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Party of {selectedParty.partySize} · Position #{selectedParty.position}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedParty(null)}
                    className="p-1 rounded-lg hover:bg-surface transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Wait Time</p>
                    <p className="text-2xl font-display font-bold">{selectedParty.waitTime} min</p>
                  </div>

                  {selectedParty.notes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Notes</p>
                      <p className="text-sm">{selectedParty.notes}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Pre-orders</p>
                    {selectedParty.preOrders && selectedParty.preOrders.length > 0 ? (
                      <div className="space-y-2">
                        {selectedParty.preOrders.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-lg bg-surface/50"
                          >
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity || 1}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-gold">
                              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <p className="font-medium">Total</p>
                          <p
                            className="font-display text-lg font-bold"
                            style={{ color: '#DC2626' }}
                          >
                            $
                            {selectedParty.preOrders
                              .reduce((sum, item) => {
                                const qty = item.quantity || 1;
                                const price = item.price || 0;
                                return sum + price * qty;
                              }, 0)
                              .toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No pre-orders</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedParty(null)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleSeat(selectedParty.id);
                      setSelectedParty(null);
                    }}
                    className="flex-1 gradient-gold text-primary-foreground shadow-gold"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Seat
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleNotify(selectedParty);
                    }}
                    className="flex-1"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notify
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAddParty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-elegant"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-semibold">Add Party</h3>
                  <button
                    onClick={() => {
                      setShowAddParty(false);
                      setAddPartyError('');
                    }}
                    className="p-1 rounded-lg hover:bg-surface transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Customer name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Party Size</label>
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setNewSize((s) => Math.max(1, s - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-display font-bold w-12 text-center">
                        {newSize}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setNewSize((s) => s + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {addPartyError && <p className="text-sm text-red-500">{addPartyError}</p>}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddParty(false);
                        setAddPartyError('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddParty}
                      className="flex-1 gradient-gold text-primary-foreground shadow-gold"
                    >
                      Add to Queue
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageShell>
  );
}
