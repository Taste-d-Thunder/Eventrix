// ─── lib/data.ts ──────────────────────────────────────────────────────────────
// Flower marketplace data — vendors, categories, helpers

// ─── Types ───────────────────────────────────────────────────────────────────

export type VendorCategory =
  | "roses"
  | "bouquets"
  | "birthday"
  | "anniversary"
  | "luxury"
  | "indoor"
  | "wedding"
  | "sympathy";

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  eventType: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  includes: string[];
  popular?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  tagline: string;
  description: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  priceUnit: string;
  images: string[];
  coverImage: string;
  tags: string[];
  packages: Package[];
  reviews: Review[];
  yearsExperience: number;
  eventsCompleted: number;
  responseTime: string;
  verified: boolean;
  featured?: boolean;
  availability: string[];
  /** Estimated delivery time */
  deliveryTime?: string;
}

export interface Category {
  id: VendorCategory;
  label: string;
  icon: string;
  description: string;
  vendorCount: number;
  color: string;
}

// ─── Categories Data ──────────────────────────────────────────────────────────

export const categories: Category[] = [
  { id: "roses", label: "Roses", icon: "🌹", description: "Classic red, pink & white roses", vendorCount: 145, color: "#EF4444" },
  { id: "bouquets", label: "Bouquets", icon: "💐", description: "Curated mixed-flower bouquets", vendorCount: 230, color: "#EC4899" },
  { id: "birthday", label: "Birthday Flowers", icon: "🎂", description: "Bright & cheerful arrangements", vendorCount: 189, color: "#F59E0B" },
  { id: "anniversary", label: "Anniversary Flowers", icon: "💕", description: "Romantic & elegant designs", vendorCount: 112, color: "#8B5CF6" },
  { id: "luxury", label: "Luxury Flowers", icon: "✨", description: "Premium orchids & exotic stems", vendorCount: 78, color: "#10B981" },
  { id: "sympathy", label: "Sympathy & Condolence", icon: "🤍", description: "Peaceful & comforting tributes", vendorCount: 64, color: "#6B7280" },
  { id: "wedding", label: "Wedding Flowers", icon: "💍", description: "Bridal bouquets & ceremony decor", vendorCount: 198, color: "#F97316" },
  { id: "indoor", label: "Indoor Plants", icon: "🪴", description: "Green plants & succulents", vendorCount: 156, color: "#22C55E" },
];

// ─── Vendors Data ─────────────────────────────────────────────────────────────

export const vendors: Vendor[] = [
  {
    id: "fl001",
    name: "Petal & Plume Flowers",
    category: "roses",
    tagline: "Handpicked roses for every occasion",
    description:
      "Mumbai's premier rose specialists. We grow and source the freshest roses — from classic Long Stem Reds to rare Garden varieties. Same-day delivery with freshness guaranteed up to 7 days.",
    location: "Juhu, Mumbai",
    city: "Mumbai",
    rating: 4.9,
    reviewCount: 412,
    startingPrice: 499,
    priceUnit: "bouquet",
    deliveryTime: "45 min",
    coverImage: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80",
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80",
    ],
    tags: ["Red Roses", "Pink Roses", "Same-Day", "Gift Wrapped", "Fresh Cut"],
    packages: [
      {
        id: "p1", name: "Classic Dozen", price: 499, unit: "bouquet",
        description: "12 premium long-stem red roses",
        includes: ["12 red roses", "Green fillers", "Gift wrap", "Card message"],
      },
      {
        id: "p2", name: "Premium 25", price: 899, unit: "bouquet",
        description: "25 roses in a luxury box",
        includes: ["25 mixed roses", "Luxury box packaging", "Ribbon", "Chocolate add-on option"],
        popular: true,
      },
      {
        id: "p3", name: "Grand 50", price: 1599, unit: "arrangement",
        description: "50 roses in a vase arrangement",
        includes: ["50 assorted roses", "Glass vase", "Baby breath fillers", "Free delivery"],
      },
    ],
    reviews: [
      { id: "r1", author: "Ananya Gupta", avatar: "https://i.pravatar.cc/100?img=1", rating: 5, date: "March 2024", comment: "The roses were absolutely stunning! Fresh, vibrant, and lasted over a week.", eventType: "Anniversary" },
      { id: "r2", author: "Rahul Verma", avatar: "https://i.pravatar.cc/100?img=2", rating: 5, date: "February 2024", comment: "Ordered for Valentine's Day — delivered in 30 minutes. My wife loved them!", eventType: "Valentine's Day" },
    ],
    yearsExperience: 12,
    eventsCompleted: 8500,
    responseTime: "45 min delivery",
    verified: true,
    featured: true,
    availability: ["2024-04-15", "2024-04-20", "2024-05-01"],
  },
  {
    id: "fl002",
    name: "Bloom Garden Florist",
    category: "bouquets",
    tagline: "Artful bouquets crafted with love",
    description:
      "We create stunning mixed-flower bouquets using seasonal blooms. Every arrangement is designed by our in-house florists with a focus on colour harmony and lasting freshness.",
    location: "Koramangala, Bangalore",
    city: "Bangalore",
    rating: 4.8,
    reviewCount: 328,
    startingPrice: 599,
    priceUnit: "bouquet",
    deliveryTime: "60 min",
    coverImage: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
    ],
    tags: ["Mixed Bouquets", "Seasonal", "Handtied", "Eco-Wrap", "Custom"],
    packages: [
      {
        id: "p1", name: "Sunshine Mix", price: 599, unit: "bouquet",
        description: "Bright seasonal mix",
        includes: ["8–10 seasonal stems", "Handtied", "Eco-friendly wrap", "Message card"],
      },
      {
        id: "p2", name: "Garden Romance", price: 999, unit: "bouquet",
        description: "Premium pastel mix",
        includes: ["15+ stems", "Roses, lilies & filler", "Satin ribbon", "Box packaging"],
        popular: true,
      },
    ],
    reviews: [
      { id: "r1", author: "Deepika Rao", avatar: "https://i.pravatar.cc/100?img=5", rating: 5, date: "March 2024", comment: "The bouquet was gorgeous — colours were so well matched. Will order again!", eventType: "Birthday" },
    ],
    yearsExperience: 8,
    eventsCompleted: 4200,
    responseTime: "1 hr delivery",
    verified: true,
    featured: true,
    availability: ["2024-04-18", "2024-04-25"],
  },
  {
    id: "fl003",
    name: "Rose Garden Mumbai",
    category: "luxury",
    tagline: "Exotic orchids & premium arrangements",
    description:
      "Specialising in luxury flower arrangements using imported orchids, peonies, and rare stems. White-glove delivery service included. Perfect for corporate gifting and high-end events.",
    location: "Bandra West, Mumbai",
    city: "Mumbai",
    rating: 5.0,
    reviewCount: 189,
    startingPrice: 1999,
    priceUnit: "arrangement",
    deliveryTime: "2 hrs",
    coverImage: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80",
      "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80",
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80",
    ],
    tags: ["Orchids", "Peonies", "Luxury", "Corporate", "White Glove"],
    packages: [
      {
        id: "p1", name: "Elegance", price: 1999, unit: "arrangement",
        description: "Single orchid stem in designer vase",
        includes: ["Phalaenopsis orchid", "Ceramic vase", "Care instructions", "Gift bag"],
      },
      {
        id: "p2", name: "Grand Luxe", price: 4999, unit: "arrangement",
        description: "Multi-stem orchid display",
        includes: ["3 orchid stems", "Premium glass vase", "Moss base", "White-glove delivery"],
        popular: true,
      },
      {
        id: "p3", name: "Corporate Collection", price: 9999, unit: "per set",
        description: "5 matching arrangements",
        includes: ["5 arrangements", "Custom colours", "Branded cards", "Setup included"],
      },
    ],
    reviews: [
      { id: "r1", author: "Priya Mehta", avatar: "https://i.pravatar.cc/100?img=7", rating: 5, date: "March 2024", comment: "The orchid arrangement was museum-quality. Our CEO was beyond impressed.", eventType: "Corporate Gift" },
    ],
    yearsExperience: 15,
    eventsCompleted: 3200,
    responseTime: "2 hr delivery",
    verified: true,
    featured: true,
    availability: ["2024-04-20", "2024-05-05"],
  },
  {
    id: "fl004",
    name: "Sunny Blooms",
    category: "birthday",
    tagline: "Bright flowers for bright days",
    description:
      "We specialise in cheerful birthday arrangements — sunflowers, gerberas, and vibrant mixed bouquets. Add-on cakes, chocolates, and balloons available.",
    location: "HSR Layout, Bangalore",
    city: "Bangalore",
    rating: 4.7,
    reviewCount: 276,
    startingPrice: 449,
    priceUnit: "combo",
    deliveryTime: "30 min",
    coverImage: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80",
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
    ],
    tags: ["Birthday", "Sunflowers", "Gerberas", "Cake Combo", "Express"],
    packages: [
      {
        id: "p1", name: "Smile Bundle", price: 449, unit: "combo",
        description: "Birthday flowers + card",
        includes: ["6 gerberas", "Birthday card", "Colour wrap", "Balloon add-on ₹99"],
      },
      {
        id: "p2", name: "Party Pack", price: 999, unit: "combo",
        description: "Flowers + cake + chocolates",
        includes: ["12 mixed flowers", "500g cake", "Ferrero box", "Birthday banner"],
        popular: true,
      },
    ],
    reviews: [
      { id: "r1", author: "Kavita Shetty", avatar: "https://i.pravatar.cc/100?img=9", rating: 5, date: "February 2024", comment: "The birthday combo was perfect — flowers, cake, and chocolates all delivered together!", eventType: "Birthday" },
    ],
    yearsExperience: 5,
    eventsCompleted: 6100,
    responseTime: "30 min express",
    verified: true,
    featured: true,
    availability: ["2024-04-15", "2024-04-28"],
  },
  {
    id: "fl005",
    name: "Eternal Petals",
    category: "anniversary",
    tagline: "Celebrate love with timeless arrangements",
    description:
      "Romantic flower arrangements designed for anniversaries and special milestones. Heart-shaped boxes, preserved roses, and personalised messages.",
    location: "Lajpat Nagar, Delhi",
    city: "Delhi",
    rating: 4.8,
    reviewCount: 198,
    startingPrice: 799,
    priceUnit: "box",
    deliveryTime: "90 min",
    coverImage: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80",
      "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80",
    ],
    tags: ["Anniversary", "Heart Box", "Preserved", "Romantic", "Personalised"],
    packages: [
      {
        id: "p1", name: "Love Note", price: 799, unit: "box",
        description: "Heart-shaped rose box",
        includes: ["9 roses in heart box", "Personalised message", "Ribbon", "Free delivery"],
      },
      {
        id: "p2", name: "Forever Rose", price: 1499, unit: "box",
        description: "Preserved rose that lasts a year",
        includes: ["1 preserved rose", "Glass dome case", "LED base", "Gift bag"],
        popular: true,
      },
    ],
    reviews: [
      { id: "r1", author: "Suresh Kumar", avatar: "https://i.pravatar.cc/100?img=11", rating: 5, date: "January 2024", comment: "The preserved rose in glass dome was stunning. My wife keeps it on her desk.", eventType: "Anniversary" },
    ],
    yearsExperience: 7,
    eventsCompleted: 2800,
    responseTime: "90 min delivery",
    verified: true,
    featured: true,
    availability: ["2024-04-18", "2024-05-02"],
  },
  {
    id: "fl006",
    name: "Green Haven Nursery",
    category: "indoor",
    tagline: "Bring nature indoors",
    description:
      "Indoor plants, succulents, and terrariums delivered to your door. Perfect for home décor, offices, and gifts. Complete with pots and care guides.",
    location: "Powai, Mumbai",
    city: "Mumbai",
    rating: 4.6,
    reviewCount: 154,
    startingPrice: 349,
    priceUnit: "plant",
    deliveryTime: "Same day",
    coverImage: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    ],
    tags: ["Indoor Plants", "Succulents", "Terrariums", "Air Purifying", "Gift Set"],
    packages: [
      {
        id: "p1", name: "Desk Buddy", price: 349, unit: "plant",
        description: "Small succulent in ceramic pot",
        includes: ["1 succulent", "Ceramic pot", "Pebbles", "Care card"],
      },
      {
        id: "p2", name: "Green Gift Set", price: 899, unit: "set",
        description: "3 plants in a gift box",
        includes: ["3 indoor plants", "Designer pots", "Gift box", "Care guide booklet"],
        popular: true,
      },
    ],
    reviews: [
      { id: "r1", author: "Rohit Joshi", avatar: "https://i.pravatar.cc/100?img=13", rating: 5, date: "March 2024", comment: "The succulents arrived in perfect condition. Beautiful pots too!", eventType: "Gift" },
    ],
    yearsExperience: 10,
    eventsCompleted: 4500,
    responseTime: "Same day delivery",
    verified: true,
    featured: true,
    availability: ["2024-04-20", "2024-04-27"],
  },
  {
    id: "fl007",
    name: "Bridal Bloom Studio",
    category: "wedding",
    tagline: "Dreamy florals for your perfect day",
    description:
      "Full-service wedding floristry — from bridal bouquets and boutonnieres to mandap decoration and table centrepieces. Free consultation included.",
    location: "Indiranagar, Bangalore",
    city: "Bangalore",
    rating: 4.9,
    reviewCount: 312,
    startingPrice: 2999,
    priceUnit: "starting",
    deliveryTime: "Scheduled",
    coverImage: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    ],
    tags: ["Wedding", "Bridal Bouquet", "Mandap", "Centrepieces", "Consultation"],
    packages: [
      {
        id: "p1", name: "Bridal Essentials", price: 2999, unit: "starting",
        description: "Bouquet + boutonniere",
        includes: ["Bridal bouquet", "Groom boutonniere", "2 corsages", "Free consultation"],
      },
      {
        id: "p2", name: "Full Wedding", price: 15000, unit: "starting",
        description: "Complete venue florals",
        includes: ["Bridal bouquet", "12 table centrepieces", "Stage decoration", "Aisle flowers", "Day-of setup"],
        popular: true,
      },
    ],
    reviews: [
      { id: "r1", author: "Shruti Agarwal", avatar: "https://i.pravatar.cc/100?img=15", rating: 5, date: "February 2024", comment: "Our wedding flowers were everything we dreamed of. The team was so professional.", eventType: "Wedding" },
    ],
    yearsExperience: 14,
    eventsCompleted: 1800,
    responseTime: "Scheduled delivery",
    verified: true,
    featured: true,
    availability: ["2024-04-20", "2024-05-01"],
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

/** Get vendors filtered by category */
export function getVendorsByCategory(category: VendorCategory): Vendor[] {
  return vendors.filter((v) => v.category === category);
}

/** Get a single vendor by ID */
export function getVendorById(id: string): Vendor | undefined {
  return vendors.find((v) => v.id === id);
}

/** Get featured vendors across all categories */
export function getFeaturedVendors(): Vendor[] {
  return vendors.filter((v) => v.featured);
}

/** Format Indian currency */
export function formatPrice(price: number): string {
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  }
  if (price >= 1000) {
    return `₹${(price / 1000).toFixed(0)}K`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

/** Get category details by ID */
export function getCategoryById(id: VendorCategory): Category | undefined {
  return categories.find((c) => c.id === id);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonials = [
  {
    id: "t1",
    name: "Riya & Aryan",
    event: "Anniversary • March 2024",
    avatar: "https://i.pravatar.cc/100?img=20",
    quote:
      "The roses were absolutely stunning! Fresh, fragrant, and delivered right on time. Our anniversary was perfect thanks to Petal & Plume.",
    location: "Mumbai",
  },
  {
    id: "t2",
    name: "Nandita Krishnan",
    event: "Corporate Event • February 2024",
    avatar: "https://i.pravatar.cc/100?img=21",
    quote:
      "We ordered 50 flower arrangements for our company gala. Every single one was flawless. The team handled everything from selection to setup.",
    location: "Bangalore",
  },
  {
    id: "t3",
    name: "Vikram Patel",
    event: "Birthday • January 2024",
    avatar: "https://i.pravatar.cc/100?img=22",
    quote:
      "The birthday combo with flowers, cake, and chocolates was a hit! My mom was so surprised. Express delivery in just 30 minutes — amazing service.",
    location: "Delhi",
  },
];
