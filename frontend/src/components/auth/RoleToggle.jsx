import { Users, Store } from "lucide-react";

export function RoleToggle({ value, onChange }) {
  const opts = [
    { id: "customer", label: "Customer", desc: "Join queues, pre-order, dine.", icon: Users },
    {
      id: "owner",
      label: "Restaurant Owner",
      desc: "Manage your live queue & staff.",
      icon: Store,
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {opts.map((o) => {
        const active = value === o.id;
        const Icon = o.icon;
        return (
          <button
            type="button"
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`text-left rounded-xl border p-4 transition ${
              active ? "border-gold bg-gold/5 shadow-gold" : "border-border hover:border-gold/40"
            }`}
          >
            <div
              className={`h-9 w-9 rounded-lg grid place-items-center mb-2 ${
                active ? "gradient-gold text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <p className="font-medium text-sm">{o.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{o.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
