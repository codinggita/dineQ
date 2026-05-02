import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed, LogOut } from 'lucide-react';
import { useRole, setStoredRole } from '@/lib/role';
import { motion, AnimatePresence } from 'framer-motion';

const customerNav = [
  { to: '/my-queue', label: 'My Queue' },
  { to: '/restaurants', label: 'Top Restaurants' },
  { to: '/history', label: 'History' },
  { to: '/profile', label: 'Profile' },
];

const ownerNav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/owner-history', label: 'History' },
  { to: '/restaurants', label: 'Discover' },
  { to: '/profile', label: 'Profile' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const role = useRole();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.avatar && !parsed.avatar.startsWith('http')) {
        parsed.avatar = `${import.meta.env.VITE_API_URL}${parsed.avatar}`;
        localStorage.setItem('user', JSON.stringify(parsed));
      }
      setUser(parsed);
    }
  }, []);

  const nav = role === 'owner' ? ownerNav : customerNav;

  function signOut() {
    setStoredRole('customer');
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-50 glass-panel">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg gradient-gold grid place-items-center shadow-gold transition group-hover:scale-105">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            Dine<span className="text-gold">Q</span>
          </span>
          {role === 'owner' && (
            <span className="ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-gold/40 text-gold bg-gold/5">
              Owner
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition rounded-md hover:bg-secondary/50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
          ) : user?.name ? (
            <div className="h-8 w-8 rounded-full bg-gold/10 grid place-items-center text-xs font-bold text-gold">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
          ) : null}
          <button
            onClick={signOut}
            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5 hover:bg-secondary/50 rounded-md"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-secondary"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/60 px-4 py-3 space-y-1 glass-card absolute w-full overflow-hidden"
          >
            {user?.avatar ? (
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            ) : null}
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/50 transition"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="w-full text-center px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary/50 transition"
              >
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
