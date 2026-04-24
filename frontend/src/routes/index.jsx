import { Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { restaurants } from "@/data/restaurants";
import { Clock, Bell, ShoppingBag, MapPin, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Landing() {
  const featured = restaurants.slice(0, 3);
  return (
    <PageShell>
      <section className="relative overflow-hidden noise-bg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 -z-10 opacity-40"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-gold/5 blur-3xl"
          />
        </motion.div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-medium"
              >
                <Sparkles className="h-3.5 w-3.5" /> Real-time. No reservations needed.
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
              >
                Skip the wait. <span className="gradient-text-gold">Savor the moment.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-lg text-muted-foreground max-w-xl"
              >
                Live wait times for the city's best restaurants. Join the queue from anywhere,
                pre-order your meal, and arrive right when your table is ready.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/restaurants"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 transition"
                  >
                    Find a table <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:border-gold/40 hover:text-gold transition font-medium"
                  >
                    Create free account
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-10 grid grid-cols-3 gap-6 max-w-md"
              >
                {[
                  { n: "2,400+", l: "Restaurants" },
                  { n: "180k", l: "Diners served" },
                  { n: "14 min", l: "Avg saved" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <Stat n={stat.n} l={stat.l} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/60">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80"
                  alt="Elegant restaurant interior"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-6 -left-6 hidden sm:block bg-card/95 backdrop-blur border border-border rounded-2xl p-4 shadow-elegant w-64"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-10 w-10 rounded-full gradient-gold grid place-items-center"
                  >
                    <Bell className="h-5 w-5 text-primary-foreground" />
                  </motion.div>
                  <div>
                    <p className="text-xs text-muted-foreground">Your turn in</p>
                    <p className="font-display font-semibold text-lg">7 minutes</p>
                  </div>
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 0.75 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden"
                >
                  <div className="h-full w-full gradient-gold origin-left" />
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute -top-4 -right-4 hidden sm:block bg-card/95 backdrop-blur border border-border rounded-2xl p-4 shadow-elegant"
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-[oklch(0.7_0.16_145)]"
                  />
                  <p className="text-xs font-medium">Live</p>
                </div>
                <p className="mt-1 text-2xl font-display font-bold gradient-text-gold">12</p>
                <p className="text-xs text-muted-foreground">parties ahead</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold">Everything you need before the bite</h2>
          <p className="mt-3 text-muted-foreground">
            Built for diners who refuse to waste an evening standing on a sidewalk.
          </p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Clock,
              title: "Live wait times",
              desc: "See exact wait estimates updated every minute. No more vague 'maybe 30?' answers.",
            },
            {
              icon: MapPin,
              title: "Join from anywhere",
              desc: "Hop in the virtual queue from your couch, the bar next door, or a cab on the way.",
            },
            {
              icon: ShoppingBag,
              title: "Pre-order while you wait",
              desc: "Browse menus and order ahead. Your food arrives moments after you sit down.",
            },
          ].map((f, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Feature icon={f.icon} title={f.title} desc={f.desc} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-3xl border border-border/60 bg-surface p-8 sm:p-12"
        >
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { n: "01", t: "Browse", d: "Discover top restaurants with live wait times." },
              { n: "02", t: "Join queue", d: "Tap once. Your spot is held in real-time." },
              { n: "03", t: "Pre-order", d: "Pick your dishes while you're still on the way." },
              { n: "04", t: "Sit & savor", d: "Arrive, get notified, eat sooner." },
            ].map((s, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Step n={s.n} t={s.t} d={s.d} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">Trending tonight</h2>
            <p className="mt-2 text-muted-foreground">Most-joined queues in the last hour.</p>
          </div>
          <Link
            to="/restaurants"
            className="text-sm text-gold hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featured.map((r, i) => (
            <motion.div key={r.id} variants={itemVariants}>
              <RestaurantCard r={r} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="relative overflow-hidden rounded-3xl border border-gold/20 p-10 sm:p-16 text-center bg-surface">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute inset-0 -z-10 opacity-30"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          </motion.div>
          <ShieldCheck className="h-10 w-10 mx-auto text-gold" />
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold">Your evening, on your terms.</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Join thousands who never wait blind again. Free to use, always.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3 justify-center"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/register"
                className="px-6 py-3 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90"
              >
                Create your account
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/restaurants"
                className="px-6 py-3 rounded-lg border border-border hover:border-gold/40 hover:text-gold font-medium"
              >
                Explore restaurants
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </PageShell>
  );
}

function Stat({ n, l }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold gradient-text-gold">{n}</p>
      <p className="text-xs text-muted-foreground mt-1">{l}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="rounded-2xl border border-border/60 p-6 bg-card hover:border-gold/40 transition group"
    >
      <motion.div
        whileHover={{ rotate: 5, scale: 1.1 }}
        className="h-11 w-11 rounded-lg bg-gold/10 grid place-items-center text-gold group-hover:bg-gold group-hover:text-primary-foreground transition"
      >
        <Icon className="h-5 w-5" />
      </motion.div>
      <h3 className="mt-5 font-display font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function Step({ n, t, d }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
      <p className="font-display text-3xl font-bold gradient-text-gold">{n}</p>
      <h4 className="mt-3 font-semibold">{t}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{d}</p>
    </motion.div>
  );
}
