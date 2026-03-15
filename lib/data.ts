// ─── Types ───────────────────────────────────────────────────────────────────

export type VendorCategory =
  | "venues"
  | "photographers"
  | "caterers"
  | "decorators"
  | "djs"
  | "cakes"
  | "makeup";

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
  {
    id: "venues",
    label: "Venues",
    icon: "🏛️",
    description: "Ballrooms, gardens & more",
    vendorCount: 284,
    color: "#F59E0B",
  },
  {
    id: "photographers",
    label: "Photographers",
    icon: "📸",
    description: "Capture every moment",
    vendorCount: 512,
    color: "#3B82F6",
  },
  {
    id: "caterers",
    label: "Caterers",
    icon: "🍽️",
    description: "Exquisite dining experiences",
    vendorCount: 198,
    color: "#10B981",
  },
  {
    id: "decorators",
    label: "Decorators",
    icon: "🌸",
    description: "Transform your space",
    vendorCount: 367,
    color: "#EC4899",
  },
  {
    id: "djs",
    label: "DJs & Music",
    icon: "🎵",
    description: "Set the perfect vibe",
    vendorCount: 143,
    color: "#8B5CF6",
  },
  {
    id: "cakes",
    label: "Cake Artists",
    icon: "🎂",
    description: "Sweet masterpieces",
    vendorCount: 221,
    color: "#F97316",
  },
  {
    id: "makeup",
    label: "Makeup Artists",
    icon: "💄",
    description: "Look your absolute best",
    vendorCount: 389,
    color: "#EF4444",
  },
];

// ─── Vendors Data ─────────────────────────────────────────────────────────────

export const vendors: Vendor[] = [
  // ── Venues ──
  {
    id: "v001",
    name: "The Grand Maison",
    category: "venues",
    tagline: "Timeless elegance for unforgettable celebrations",
    description:
      "Set within 5 acres of manicured gardens, The Grand Maison is Mumbai's premier luxury event venue. With soaring ceilings, crystal chandeliers, and a dedicated team of event coordinators, we transform your vision into reality. Our spaces accommodate from 50 to 1,200 guests.",
    location: "Juhu, Mumbai",
    city: "Mumbai",
    rating: 4.9,
    reviewCount: 312,
    startingPrice: 150000,
    priceUnit: "per day",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
      "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=80",
    ],
    tags: ["Luxury", "Garden", "Ballroom", "In-house Catering", "Parking"],
    packages: [
      {
        id: "p1",
        name: "Silver",
        price: 150000,
        unit: "per day",
        description: "Perfect for intimate celebrations",
        includes: ["Up to 200 guests", "8-hour booking", "Basic lighting", "Changing room"],
      },
      {
        id: "p2",
        name: "Gold",
        price: 280000,
        unit: "per day",
        description: "Our most popular package",
        includes: [
          "Up to 500 guests",
          "12-hour booking",
          "Premium lighting",
          "Bridal suite",
          "Dedicated coordinator",
        ],
        popular: true,
      },
      {
        id: "p3",
        name: "Platinum",
        price: 500000,
        unit: "per day",
        description: "An all-encompassing luxury experience",
        includes: [
          "Up to 1200 guests",
          "Full day & night",
          "Custom lighting design",
          "VIP suites",
          "Full event team",
          "Valet parking",
        ],
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Priya Sharma",
        avatar: "https://i.pravatar.cc/100?img=1",
        rating: 5,
        date: "March 2024",
        comment:
          "Absolutely breathtaking venue. Every detail was perfect. Our guests couldn't stop complimenting the ambiance.",
        eventType: "Wedding",
      },
      {
        id: "r2",
        author: "Rahul Mehta",
        avatar: "https://i.pravatar.cc/100?img=2",
        rating: 5,
        date: "February 2024",
        comment:
          "The team was incredibly professional. Setup was done to perfection and the garden looked magical.",
        eventType: "Corporate Gala",
      },
    ],
    yearsExperience: 18,
    eventsCompleted: 2840,
    responseTime: "Within 2 hours",
    verified: true,
    featured: true,
    availability: ["2024-04-15", "2024-04-20", "2024-05-01"],
  },
  {
    id: "v002",
    name: "Bloom Garden Estate",
    category: "venues",
    tagline: "Where nature meets celebration",
    description:
      "A stunning outdoor venue nestled in the Aravalli hills. Perfect for intimate weddings and milestone events.",
    location: "Mehrauli, Delhi",
    city: "Delhi",
    rating: 4.7,
    reviewCount: 189,
    startingPrice: 85000,
    priceUnit: "per day",
    coverImage: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    ],
    tags: ["Outdoor", "Garden", "Heritage", "Natural Light"],
    packages: [
      {
        id: "p1",
        name: "Garden Bliss",
        price: 85000,
        unit: "per day",
        description: "For intimate gatherings",
        includes: ["Up to 150 guests", "8-hour booking", "Garden access"],
      },
      {
        id: "p2",
        name: "Estate Full",
        price: 175000,
        unit: "per day",
        description: "Full estate access",
        includes: ["Up to 400 guests", "Full day", "All areas", "Coordinator"],
        popular: true,
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Ananya Gupta",
        avatar: "https://i.pravatar.cc/100?img=3",
        rating: 5,
        date: "January 2024",
        comment: "The most beautiful backdrop for our wedding. The garden is absolutely stunning.",
        eventType: "Wedding",
      },
    ],
    yearsExperience: 12,
    eventsCompleted: 1240,
    responseTime: "Within 4 hours",
    verified: true,
    availability: ["2024-04-18", "2024-04-25"],
  },

  // ── Photographers ──
  {
    id: "ph001",
    name: "Arjun Kapoor Photography",
    category: "photographers",
    tagline: "Crafting stories through light and emotion",
    description:
      "Award-winning photographer specializing in weddings and lifestyle events. Every frame is composed like a painting — rich, emotional, and timeless. Available for destination shoots across India and internationally.",
    location: "Bandra, Mumbai",
    city: "Mumbai",
    rating: 5.0,
    reviewCount: 428,
    startingPrice: 45000,
    priceUnit: "per day",
    coverImage: "https://images.unsplash.com/photo-1471347334704-25603ca4b082?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1471347334704-25603ca4b082?w=800&q=80",
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
    ],
    tags: ["Wedding", "Candid", "Destination", "Editorial", "Film"],
    packages: [
      {
        id: "p1",
        name: "Classic",
        price: 45000,
        unit: "per day",
        description: "One photographer for 8 hours",
        includes: [
          "1 photographer",
          "8 hours coverage",
          "500+ edited photos",
          "Online gallery",
          "30-day delivery",
        ],
      },
      {
        id: "p2",
        name: "Premium",
        price: 80000,
        unit: "per day",
        description: "Duo team with videography",
        includes: [
          "2 photographers",
          "12 hours coverage",
          "1000+ edited photos",
          "Cinematic highlights reel",
          "Online gallery",
          "Premium album",
        ],
        popular: true,
      },
      {
        id: "p3",
        name: "Complete",
        price: 150000,
        unit: "per event",
        description: "Full event documentation",
        includes: [
          "3 photographers",
          "Full event",
          "Unlimited edited photos",
          "2 films (short & long)",
          "Luxury album",
          "Canvas prints",
        ],
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Meera Pillai",
        avatar: "https://i.pravatar.cc/100?img=5",
        rating: 5,
        date: "March 2024",
        comment:
          "Arjun captured emotions we didn't even know were happening. The photos made us cry. Pure magic.",
        eventType: "Wedding",
      },
      {
        id: "r2",
        author: "Vikram Nair",
        avatar: "https://i.pravatar.cc/100?img=6",
        rating: 5,
        date: "February 2024",
        comment:
          "Professional, creative, and incredibly talented. Our engagement shoot was beyond expectations.",
        eventType: "Engagement",
      },
    ],
    yearsExperience: 11,
    eventsCompleted: 890,
    responseTime: "Within 1 hour",
    verified: true,
    featured: true,
    availability: ["2024-04-20", "2024-05-05"],
  },
  {
    id: "ph002",
    name: "Lens & Lace Studio",
    category: "photographers",
    tagline: "Feminine, romantic, and entirely yours",
    description:
      "Specializing in intimate ceremonies, bridal portraits, and heirloom photography. Our aesthetic is soft, dreamy, and deeply personal.",
    location: "Koramangala, Bangalore",
    city: "Bangalore",
    rating: 4.8,
    reviewCount: 276,
    startingPrice: 35000,
    priceUnit: "per day",
    coverImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
      "https://images.unsplash.com/photo-1471347334704-25603ca4b082?w=800&q=80",
    ],
    tags: ["Romantic", "Bridal", "Editorial", "Intimate"],
    packages: [
      {
        id: "p1",
        name: "Elopement",
        price: 35000,
        unit: "per session",
        description: "For intimate ceremonies",
        includes: ["1 photographer", "6 hours", "300+ edits", "Digital gallery"],
      },
      {
        id: "p2",
        name: "Wedding Day",
        price: 65000,
        unit: "per day",
        description: "Full wedding coverage",
        includes: ["2 photographers", "Full day", "800+ edits", "Film option"],
        popular: true,
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Deepika Rao",
        avatar: "https://i.pravatar.cc/100?img=7",
        rating: 5,
        date: "December 2023",
        comment: "The photos look like they're from a fashion magazine. Absolutely stunning work.",
        eventType: "Wedding",
      },
    ],
    yearsExperience: 7,
    eventsCompleted: 340,
    responseTime: "Within 3 hours",
    verified: true,
    availability: ["2024-04-22", "2024-05-10"],
  },

  // ── Caterers ──
  {
    id: "c001",
    name: "Saffron & Salt Catering",
    category: "caterers",
    tagline: "Heritage recipes, contemporary presentation",
    description:
      "We bring over three decades of culinary tradition to your event. Specializing in North Indian, Mughlai, and fusion menus. Our chefs have trained at top hotels and our presentation rivals fine dining.",
    location: "Lajpat Nagar, Delhi",
    city: "Delhi",
    rating: 4.8,
    reviewCount: 543,
    startingPrice: 1200,
    priceUnit: "per person",
    coverImage: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    ],
    tags: ["North Indian", "Mughlai", "Live Counters", "Veg & Non-Veg", "Dessert Station"],
    packages: [
      {
        id: "p1",
        name: "Classic Spread",
        price: 1200,
        unit: "per person",
        description: "Traditional Indian feast",
        includes: ["5 veg dishes", "2 non-veg dishes", "Breads & Rice", "Desserts", "Beverages"],
      },
      {
        id: "p2",
        name: "Royal Banquet",
        price: 2200,
        unit: "per person",
        description: "Premium multi-cuisine",
        includes: [
          "8+ veg dishes",
          "4 non-veg dishes",
          "Live counters",
          "Premium dessert station",
          "Mocktail bar",
        ],
        popular: true,
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Suresh Kumar",
        avatar: "https://i.pravatar.cc/100?img=9",
        rating: 5,
        date: "February 2024",
        comment:
          "The biryani was the talk of the wedding! Guests were lining up for seconds. Outstanding food.",
        eventType: "Wedding Reception",
      },
    ],
    yearsExperience: 32,
    eventsCompleted: 5600,
    responseTime: "Within 2 hours",
    verified: true,
    featured: true,
    availability: ["2024-04-15", "2024-04-28"],
  },

  // ── Decorators ──
  {
    id: "d001",
    name: "Petal & Plume Design Co.",
    category: "decorators",
    tagline: "Transforming spaces into extraordinary experiences",
    description:
      "A boutique decoration studio with an editorial eye. We specialize in floral installations, lighting design, and immersive tablescapes. Our work has been featured in Vogue Weddings and Harper's Bazaar.",
    location: "Powai, Mumbai",
    city: "Mumbai",
    rating: 4.9,
    reviewCount: 387,
    startingPrice: 75000,
    priceUnit: "starting",
    coverImage: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    ],
    tags: ["Floral", "Luxury", "Editorial", "Lighting Design", "Mandap"],
    packages: [
      {
        id: "p1",
        name: "Bloom",
        price: 75000,
        unit: "starting",
        description: "Elegant floral accents",
        includes: ["Stage decoration", "Table centerpieces", "Welcome arch", "Basic lighting"],
      },
      {
        id: "p2",
        name: "Opulence",
        price: 250000,
        unit: "starting",
        description: "Full venue transformation",
        includes: [
          "Full floral installation",
          "Custom lighting design",
          "All areas decorated",
          "Photo backdrop",
          "Day-of coordinator",
        ],
        popular: true,
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Kavita Desai",
        avatar: "https://i.pravatar.cc/100?img=11",
        rating: 5,
        date: "March 2024",
        comment:
          "We gave them a Pinterest board and they exceeded every single pin. Jaw-dropping work.",
        eventType: "Wedding",
      },
    ],
    yearsExperience: 9,
    eventsCompleted: 720,
    responseTime: "Within 6 hours",
    verified: true,
    featured: true,
    availability: ["2024-04-18", "2024-05-02"],
  },

  // ── DJs ──
  {
    id: "dj001",
    name: "DJ Prism",
    category: "djs",
    tagline: "Read the room. Own the night.",
    description:
      "One of India's most sought-after wedding DJs. Known for seamless genre transitions, impeccable timing, and a playlist that evolves with your crowd. Premium sound systems included.",
    location: "Andheri, Mumbai",
    city: "Mumbai",
    rating: 4.9,
    reviewCount: 621,
    startingPrice: 40000,
    priceUnit: "per event",
    coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"],
    tags: ["Bollywood", "EDM", "Retro", "Live Mixing", "Sound System"],
    packages: [
      {
        id: "p1",
        name: "Cocktail",
        price: 40000,
        unit: "4 hours",
        description: "Perfect for cocktail hours",
        includes: ["4 hours of music", "Professional sound system", "Basic lighting", "MC option"],
      },
      {
        id: "p2",
        name: "Full Night",
        price: 85000,
        unit: "per event",
        description: "Dance the night away",
        includes: [
          "8 hours of music",
          "Premium sound system",
          "LED lighting rig",
          "MC services",
          "Fog machine",
        ],
        popular: true,
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Rohit Joshi",
        avatar: "https://i.pravatar.cc/100?img=13",
        rating: 5,
        date: "March 2024",
        comment:
          "The dance floor was packed ALL night. He mixed 90s Bollywood with EDM seamlessly. Legendary!",
        eventType: "Wedding Reception",
      },
    ],
    yearsExperience: 14,
    eventsCompleted: 1850,
    responseTime: "Within 1 hour",
    verified: true,
    featured: true,
    availability: ["2024-04-20", "2024-04-27"],
  },

  // ── Cakes ──
  {
    id: "ck001",
    name: "Sugar Atelier by Nisha",
    category: "cakes",
    tagline: "Edible art for the most special moments",
    description:
      "Pastry chef trained in Paris with 12 years creating bespoke celebration cakes. Each creation is sculpted, painted, and tasted with obsessive attention to detail.",
    location: "Indiranagar, Bangalore",
    city: "Bangalore",
    rating: 5.0,
    reviewCount: 298,
    startingPrice: 8000,
    priceUnit: "starting",
    coverImage: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80"],
    tags: ["Custom Design", "Fondant", "Buttercream", "Multi-tier", "Sugar Flowers"],
    packages: [
      {
        id: "p1",
        name: "Artisan",
        price: 8000,
        unit: "starting",
        description: "2-tier custom cake",
        includes: ["2-tier cake", "Custom design", "1 flavor", "Fondant finish"],
      },
      {
        id: "p2",
        name: "Grand Creation",
        price: 35000,
        unit: "starting",
        description: "Multi-tier showstopper",
        includes: [
          "4-5 tier cake",
          "Complex custom design",
          "Multiple flavors",
          "Sugar flowers",
          "Gold details",
        ],
        popular: true,
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Shruti Agarwal",
        avatar: "https://i.pravatar.cc/100?img=15",
        rating: 5,
        date: "February 2024",
        comment:
          "Our 5-tier cake was so beautiful people didn't want to cut it! And the taste was even better.",
        eventType: "Wedding",
      },
    ],
    yearsExperience: 12,
    eventsCompleted: 1200,
    responseTime: "Within 4 hours",
    verified: true,
    featured: true,
    availability: ["2024-04-20", "2024-05-01"],
  },

  // ── Makeup ──
  {
    id: "mu001",
    name: "Gloss & Grace Studio",
    category: "makeup",
    tagline: "Effortlessly you, impossibly beautiful",
    description:
      "A team of 6 certified MUAs specializing in bridal, editorial, and event makeup. We use only luxury, long-wearing products and customize every look to your skin tone, features, and event.",
    location: "HSR Layout, Bangalore",
    city: "Bangalore",
    rating: 4.9,
    reviewCount: 512,
    startingPrice: 12000,
    priceUnit: "per person",
    coverImage: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"],
    tags: ["Bridal", "HD Makeup", "Airbrush", "South Indian", "North Indian"],
    packages: [
      {
        id: "p1",
        name: "Signature",
        price: 12000,
        unit: "per session",
        description: "Bridal makeup & hair",
        includes: ["Makeup", "Hairstyling", "Pre-event consultation", "Touch-up kit"],
      },
      {
        id: "p2",
        name: "Bridal Package",
        price: 45000,
        unit: "multi-day",
        description: "Complete wedding look coverage",
        includes: [
          "Mehendi day",
          "Haldi look",
          "Wedding day makeup & hair",
          "Reception look",
          "2 assistants",
        ],
        popular: true,
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Pooja Shetty",
        avatar: "https://i.pravatar.cc/100?img=17",
        rating: 5,
        date: "January 2024",
        comment:
          "I've never felt more beautiful in my life. The makeup lasted 12 hours without a single touch-up.",
        eventType: "Wedding",
      },
    ],
    yearsExperience: 10,
    eventsCompleted: 2100,
    responseTime: "Within 2 hours",
    verified: true,
    featured: true,
    availability: ["2024-04-18", "2024-04-25"],
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
    event: "Wedding • March 2024",
    avatar: "https://i.pravatar.cc/100?img=20",
    quote:
      "EventSpace made planning our wedding feel like a dream. We found our photographer, decorator, and caterer all in one place. The vendors were spectacular.",
    location: "Mumbai",
  },
  {
    id: "t2",
    name: "Nandita Krishnan",
    event: "Corporate Gala • February 2024",
    avatar: "https://i.pravatar.cc/100?img=21",
    quote:
      "As an event manager, I've tried many platforms. EventSpace has the most verified vendors with actual quality. Our company's annual gala was a massive hit.",
    location: "Bangalore",
  },
  {
    id: "t3",
    name: "Siddharth & Prachi",
    event: "Engagement Ceremony • January 2024",
    avatar: "https://i.pravatar.cc/100?img=22",
    quote:
      "From our first search to the last review, the experience was seamless. The vendor profiles are honest and the booking process was stress-free.",
    location: "Delhi",
  },
];

export const stats = [
  { value: "2,000+", label: "Verified Vendors" },
  { value: "50,000+", label: "Events Organized" },
  { value: "15", label: "Cities Covered" },
  { value: "4.9★", label: "Average Rating" },
];
