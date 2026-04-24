import { Link, useNavigate } from "react-router-dom";
import { UtensilsCrossed, Mail, Lock, User, Phone, ArrowRight, Check, Store } from "lucide-react";
import { useState } from "react";
import { RoleToggle } from "@/components/auth/RoleToggle";
import { setStoredRole } from "@/lib/role";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const set = (k) => (v) => setForm({ ...form, [k]: v });

  function handleSubmit(e) {
    e.preventDefault();
    setStoredRole(role);
    navigate(role === "owner" ? "/dashboard" : "/restaurants");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12 sm:px-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-lg gradient-gold grid place-items-center">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg">
              Queue<span className="text-gold">Table</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-muted-foreground">Pick your role to get started.</p>

          <div className="mt-6">
            <RoleToggle value={role} onChange={setRole} />
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <Field
              label={role === "owner" ? "Restaurant name" : "Full name"}
              icon={role === "owner" ? Store : User}
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder={role === "owner" ? "Ember & Oak" : "Jane Doe"}
            />
            <Field
              label="Email"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
            />
            <Field
              label="Phone"
              icon={Phone}
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="+1 555 0102"
            />
            <Field
              label="Password"
              icon={Lock}
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="At least 8 characters"
            />

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-border bg-input accent-[var(--gold)]"
                defaultChecked
              />
              I agree to the{" "}
              <a href="#" className="text-gold hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-gold hover:underline">
                Privacy Policy
              </a>
              .
            </label>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 transition"
            >
              Create {role === "owner" ? "owner" : "customer"} account{" "}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block overflow-hidden order-1 lg:order-2">
        <img
          src="https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-background/95 via-background/70 to-background/30" />
        <div className="relative h-full flex flex-col justify-between p-12">
          <div />
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-semibold leading-tight max-w-md">
              Join the new way to dine.
            </h2>
            <ul className="space-y-3 text-sm">
              {[
                "Live wait times across 2,400+ restaurants",
                "Pre-order meals before you sit down",
                "Get notified the moment your table is ready",
                "Build a history of favorites you love",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
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
          className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-input border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition text-sm"
        />
      </div>
    </div>
  );
}
