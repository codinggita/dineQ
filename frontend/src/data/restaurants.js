export const restaurants = [
  {
    id: "ember-grill",
    name: "Ember & Oak",
    cuisine: "Modern Steakhouse",
    rating: 4.8,
    reviews: 1284,
    priceLevel: 4,
    waitMinutes: 42,
    queueCount: 18,
    distanceKm: 0.6,
    neighborhood: "Downtown",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    tags: ["Steak", "Wine", "Date Night"],
    trending: true,
  },
  {
    id: "saffron-house",
    name: "Saffron House",
    cuisine: "Indian · Tasting Menu",
    rating: 4.7,
    reviews: 902,
    priceLevel: 3,
    waitMinutes: 28,
    queueCount: 11,
    distanceKm: 1.2,
    neighborhood: "Old Quarter",
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
    tags: ["Spicy", "Vegetarian", "Tasting"],
  },
  {
    id: "kaiseki-mori",
    name: "Kaiseki Mori",
    cuisine: "Japanese Omakase",
    rating: 4.9,
    reviews: 612,
    priceLevel: 4,
    waitMinutes: 55,
    queueCount: 24,
    distanceKm: 2.1,
    neighborhood: "Riverside",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1200&q=80",
    tags: ["Sushi", "Omakase", "Premium"],
    trending: true,
  },
  {
    id: "trattoria-luce",
    name: "Trattoria Luce",
    cuisine: "Italian · Wood-fired",
    rating: 4.6,
    reviews: 1540,
    priceLevel: 2,
    waitMinutes: 18,
    queueCount: 7,
    distanceKm: 0.9,
    neighborhood: "Arts District",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    tags: ["Pizza", "Pasta", "Family"],
  },
  {
    id: "verde-botanica",
    name: "Verde Botánica",
    cuisine: "Plant-forward",
    rating: 4.5,
    reviews: 488,
    priceLevel: 2,
    waitMinutes: 12,
    queueCount: 4,
    distanceKm: 1.7,
    neighborhood: "Greenway",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
    tags: ["Vegan", "Healthy", "Brunch"],
  },
  {
    id: "le-petit-marais",
    name: "Le Petit Marais",
    cuisine: "French Bistro",
    rating: 4.7,
    reviews: 731,
    priceLevel: 3,
    waitMinutes: 35,
    queueCount: 14,
    distanceKm: 1.4,
    neighborhood: "West End",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    tags: ["Bistro", "Wine", "Romantic"],
    trending: true,
  },
];

export function priceLabel(level) {
  return "$".repeat(level);
}

export function waitTone(minutes) {
  if (minutes <= 15)
    return {
      label: "Short wait",
      color: "text-[oklch(0.7_0.16_145)]",
      dot: "bg-[oklch(0.7_0.16_145)]",
    };
  if (minutes <= 35)
    return {
      label: "Moderate",
      color: "text-[oklch(0.78_0.16_70)]",
      dot: "bg-[oklch(0.78_0.16_70)]",
    };
  return { label: "Long wait", color: "text-[oklch(0.7_0.18_30)]", dot: "bg-[oklch(0.7_0.18_30)]" };
}
