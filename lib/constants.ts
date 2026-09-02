// Central store configuration.
// Update these values any time — they drive the header, footer, checkout,
// delivery checks, and the admin "Settings" defaults.

export const STORE = {
  name: "Medex Pharmacy",
  tagline: "स्वास्थ्य, सम्मान सेवा",
  address: "785 A, B Block, Panki, Kanpur",
  landmark: "Near HDFC Bank",
  city: "Kanpur",
  state: "Uttar Pradesh",
  phone: "7084814251",
  whatsapp: "917084814251", // country code + number, digits only, for wa.me links
  email: "", // fill in your customer-facing support email
  upiId: "Medexpharmacy25@gmail.com", // shown at checkout for UPI/QR payment
  logo: "/images/logo.jpg",
  paymentQr: "/images/payment-qr.jpg",
  deliveryRadiusKm: 20,
  deliveryArea: "Kanpur Nagar (Poora)",
  freeDeliveryThreshold: 499,
  standardDeliveryCharge: 40,
  codAvailable: "conditional" as "yes" | "no" | "conditional", // depends on time/area/customer — decided per-order by staff
  openingHours: "9:00 AM – 10:00 PM, all days",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Medicines", href: "/products?category=medicines" },
  { label: "Healthcare", href: "/products?category=healthcare" },
  { label: "Personal Care", href: "/products?category=personal-care" },
  { label: "Vitamins", href: "/products?category=vitamins" },
  { label: "Baby Care", href: "/products?category=baby-care" },
  { label: "Prescription", href: "/prescriptions/upload" },
  { label: "Offers", href: "/products?discount=true" },
];

export const CATEGORIES = [
  { name: "Medicines", slug: "medicines", icon: "Pill" },
  { name: "Vitamins & Supplements", slug: "vitamins", icon: "Sparkles" },
  { name: "Personal Care", slug: "personal-care", icon: "Droplet" },
  { name: "Baby Care", slug: "baby-care", icon: "Baby" },
  { name: "First Aid", slug: "first-aid", icon: "Cross" },
  { name: "Diabetes Care", slug: "diabetes-care", icon: "Activity" },
  { name: "Skin Care", slug: "skin-care", icon: "Sun" },
  { name: "Health Devices", slug: "health-devices", icon: "Stethoscope" },
];
