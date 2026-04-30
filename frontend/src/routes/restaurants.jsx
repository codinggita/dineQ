import { PageShell } from '@/components/layout/PageShell';
import { useMemo, useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import { restaurantService } from '@/services/restaurantService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function RestaurantsPage() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('Trending');
  const [cuisine, setCuisine] = useState('All');

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const res = await restaurantService.getAll(q.trim());
        const data = res?.data || [];
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to fetch restaurants', e);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [q]);

  const sorts = ['Trending', 'Shortest wait', 'Top rated', 'Closest'];
  const cuisines = [
    'All',
    'Steakhouse',
    'Indian',
    'Japanese',
    'Italian',
    'Plant-forward',
    'French',
  ];

  const list = useMemo(() => {
    let l = [...(restaurants || [])];
    if (cuisine !== 'All')
      l = l.filter((r) => (r.cuisine || '').toLowerCase().includes(cuisine.toLowerCase()));
    if (sort === 'Shortest wait') l.sort((a, b) => (a.avgWaitTime || 0) - (b.avgWaitTime || 0));
    if (sort === 'Top rated') l.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === 'Closest') l.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    return l;
  }, [sort, cuisine, restaurants]);

  return (
    <PageShell>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-6"
      >
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <span className="text-xs uppercase tracking-widest text-gold">Discover</span>
          <h1 className="text-3xl sm:text-4xl font-bold">Top restaurants near you</h1>
          <p className="text-muted-foreground max-w-2xl">
            Live wait times across the city. Tap any restaurant to join its virtual queue.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="mt-8 rounded-2xl border border-border/60 bg-card p-4 flex flex-col lg:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search restaurant or cuisine..."
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-input border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-lg bg-input border border-border text-sm focus:border-gold focus:outline-none"
              >
                {cuisines.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="pl-10 pr-8 py-2.5 rounded-lg bg-input border border-border text-sm focus:border-gold focus:outline-none"
              >
                {sorts.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
      >
        {loading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-2xl border border-border/60 bg-card overflow-hidden"
              >
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Skeleton className="h-14 rounded-lg" />
                    <Skeleton className="h-14 rounded-lg" />
                  </div>
                  <Skeleton className="h-10 w-full mt-2" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : list.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">No restaurants match your filters.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {list.map((r) => (
              <motion.div key={r.id} variants={itemVariants}>
                <RestaurantCard r={r} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>
    </PageShell>
  );
}
