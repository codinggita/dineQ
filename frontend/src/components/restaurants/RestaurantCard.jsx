import { Link } from "react-router-dom";
import { Star, Users, Clock, MapPin, Flame } from "lucide-react";
import { priceLabel, waitTone } from "@/data/restaurants";
import { motion } from "framer-motion";

export function RestaurantCard({ r }) {
  const tone = waitTone(r.waitMinutes);
  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-gold/40 transition-all duration-300 hover:shadow-elegant"
    >
      <motion.div
        className="relative aspect-[4/3] overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
      >
        <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        {r.trending && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold text-primary-foreground text-xs font-semibold"
          >
            <Flame className="h-3 w-3" /> Trending
          </motion.span>
        )}
        <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
          <Star className="h-3 w-3 fill-gold text-gold" />
          {r.rating.toFixed(1)}
          <span className="text-muted-foreground">({r.reviews})</span>
        </div>
      </motion.div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display font-semibold text-lg leading-tight">{r.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {r.cuisine} · {priceLabel(r.priceLevel)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {r.neighborhood} · {r.distanceKm}km
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <motion.div whileHover={{ scale: 1.02 }} className="rounded-lg bg-surface p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Live wait
            </div>
            <div className={`mt-1 font-semibold flex items-center gap-1.5 ${tone.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${tone.dot} animate-pulse`} />
              {r.waitMinutes} min
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="rounded-lg bg-surface p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> In queue
            </div>
            <div className="mt-1 font-semibold">{r.queueCount} parties</div>
          </motion.div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/queue"
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg gradient-gold text-primary-foreground text-sm font-medium hover:opacity-90 transition shadow-gold"
          >
            Join virtual queue
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}
