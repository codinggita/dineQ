import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { RoleToggle } from '@/components/auth/RoleToggle';
import { setStoredRole } from '@/lib/role';

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setStoredRole(role);
    navigate(role === 'owner' ? '/dashboard' : '/restaurants');
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/70 to-background/40" />
        <div className="relative h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="h-9 w-9 rounded-lg gradient-gold grid place-items-center">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg">
              Queue<span className="text-gold">Table</span>
            </span>
          </Link>
          <div>
            <p className="font-display text-3xl font-semibold leading-tight max-w-md">
              "I haven't waited blindly outside a restaurant in months."
            </p>
            <p className="mt-4 text-sm text-muted-foreground">— Maya R., regular at Ember & Oak</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-lg gradient-gold grid place-items-center">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg">
              Queue<span className="text-gold">Table</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Choose how you want to sign in.</p>

          <div className="mt-6">
            <RoleToggle value={role} onChange={setRole} />
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <Field
              label="Email"
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            <Field
              label="Password"
              icon={Lock}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  className="rounded border-border bg-input accent-[var(--gold)]"
                />
                Remember me
              </label>
              <a href="#" className="text-gold hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 transition"
            >
              Log in as {role === 'owner' ? 'Owner' : 'Customer'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button className="w-full px-5 py-3 rounded-lg border border-border hover:border-gold/40 transition text-sm font-medium">
            Continue with Google
          </button>

          <p className="mt-8 text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition text-sm"
        />
      </div>
    </div>
  );
}
