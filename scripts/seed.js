/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Add it to .env.local first — see .env.example.");
  process.exit(1);
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const CategorySchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const ProductSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const CouponSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const SettingsSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

const CATEGORIES = [
  "Pain Relief", "Fever & Cold", "Vitamins", "Diabetes Care", "Personal Care",
  "Baby Care", "First Aid", "Skin Care", "Digestive Health",
];

const PLACEHOLDER_IMAGE = "/images/placeholder-product.png";

const PRODUCTS = [
  { name: "Paracetamol 650mg Tablet", category: "Pain Relief", brand: "GSK", manufacturer: "GlaxoSmithKline", mrp: 30, sellingPrice: 25, discountPercent: 17, stock: 5, prescriptionRequired: false, packSize: "15 tablets", composition: "Paracetamol 650mg" },
  { name: "Ibuprofen 400mg Tablet", category: "Pain Relief", brand: "Brufen", manufacturer: "Abbott", mrp: 45, sellingPrice: 40, discountPercent: 11, stock: 40, prescriptionRequired: false, packSize: "10 tablets", composition: "Ibuprofen 400mg" },
  { name: "Volini Pain Relief Gel", category: "Pain Relief", brand: "Volini", manufacturer: "Sun Pharma", mrp: 145, sellingPrice: 125, discountPercent: 14, stock: 60, prescriptionRequired: false, packSize: "50g", composition: "Diclofenac Diethylamine" },
  { name: "Diclofenac 50mg Tablet", category: "Pain Relief", brand: "Voveran", manufacturer: "Novartis", mrp: 35, sellingPrice: 32, discountPercent: 9, stock: 3, prescriptionRequired: true, packSize: "10 tablets", composition: "Diclofenac Sodium 50mg" },

  { name: "Cetirizine 10mg Tablet", category: "Fever & Cold", brand: "Cetzine", manufacturer: "Cipla", mrp: 20, sellingPrice: 18, discountPercent: 10, stock: 80, prescriptionRequired: false, packSize: "10 tablets", composition: "Cetirizine HCl 10mg" },
  { name: "Vicks Vaporub", category: "Fever & Cold", brand: "Vicks", manufacturer: "P&G", mrp: 95, sellingPrice: 85, discountPercent: 11, stock: 55, prescriptionRequired: false, packSize: "25ml" },
  { name: "Crocin Advance 500mg", category: "Fever & Cold", brand: "Crocin", manufacturer: "GSK", mrp: 30, sellingPrice: 28, discountPercent: 7, stock: 90, prescriptionRequired: false, packSize: "15 tablets" },
  { name: "Benadryl Cough Syrup", category: "Fever & Cold", brand: "Benadryl", manufacturer: "J&J", mrp: 110, sellingPrice: 99, discountPercent: 10, stock: 4, prescriptionRequired: false, packSize: "100ml" },
  { name: "Digital Thermometer", category: "Fever & Cold", brand: "Dr. Trust", manufacturer: "Dr. Trust", mrp: 250, sellingPrice: 199, discountPercent: 20, stock: 25, prescriptionRequired: false },

  { name: "Vitamin C 500mg Tablet", category: "Vitamins", brand: "Limcee", manufacturer: "Abbott", mrp: 45, sellingPrice: 39, discountPercent: 13, stock: 100, prescriptionRequired: false, packSize: "15 tablets" },
  { name: "Multivitamin Tablets", category: "Vitamins", brand: "Revital H", manufacturer: "Sun Pharma", mrp: 260, sellingPrice: 220, discountPercent: 15, stock: 45, prescriptionRequired: false, packSize: "30 tablets" },
  { name: "Vitamin D3 60000 IU", category: "Vitamins", brand: "Uprise D3", manufacturer: "Alkem", mrp: 32, sellingPrice: 30, discountPercent: 6, stock: 70, prescriptionRequired: false, packSize: "4 sachets" },
  { name: "Calcium + D3 Tablet", category: "Vitamins", brand: "Shelcal", manufacturer: "Torrent", mrp: 120, sellingPrice: 105, discountPercent: 13, stock: 65, prescriptionRequired: false, packSize: "15 tablets" },

  { name: "Glucometer Strips (Pack of 25)", category: "Diabetes Care", brand: "Accu-Chek", manufacturer: "Roche", mrp: 650, sellingPrice: 599, discountPercent: 8, stock: 30, prescriptionRequired: false },
  { name: "Metformin 500mg Tablet", category: "Diabetes Care", brand: "Glycomet", manufacturer: "USV", mrp: 40, sellingPrice: 36, discountPercent: 10, stock: 6, prescriptionRequired: true, packSize: "20 tablets" },
  { name: "Insulin Syringe (Pack of 10)", category: "Diabetes Care", brand: "BD Ultra-Fine", manufacturer: "BD", mrp: 180, sellingPrice: 165, discountPercent: 8, stock: 22, prescriptionRequired: true },
  { name: "Digital Blood Glucose Monitor", category: "Diabetes Care", brand: "Accu-Chek Active", manufacturer: "Roche", mrp: 1200, sellingPrice: 999, discountPercent: 17, stock: 15, prescriptionRequired: false },

  { name: "Dettol Antiseptic Liquid", category: "Personal Care", brand: "Dettol", manufacturer: "Reckitt", mrp: 130, sellingPrice: 115, discountPercent: 12, stock: 75, prescriptionRequired: false, packSize: "125ml" },
  { name: "Hand Sanitizer 500ml", category: "Personal Care", brand: "Lifebuoy", manufacturer: "HUL", mrp: 180, sellingPrice: 150, discountPercent: 17, stock: 50, prescriptionRequired: false },
  { name: "Surgical Face Masks (Box of 50)", category: "Personal Care", brand: "Medex Care", manufacturer: "Medex Pharmacy", mrp: 250, sellingPrice: 199, discountPercent: 20, stock: 40, prescriptionRequired: false },
  { name: "N95 Respirator Mask", category: "Personal Care", brand: "3M", manufacturer: "3M", mrp: 60, sellingPrice: 49, discountPercent: 18, stock: 100, prescriptionRequired: false },

  { name: "Baby Diapers (Medium, Pack of 30)", category: "Baby Care", brand: "Pampers", manufacturer: "P&G", mrp: 599, sellingPrice: 520, discountPercent: 13, stock: 35, prescriptionRequired: false },
  { name: "Baby Massage Oil", category: "Baby Care", brand: "Johnson's Baby", manufacturer: "J&J", mrp: 210, sellingPrice: 189, discountPercent: 10, stock: 48, prescriptionRequired: false, packSize: "200ml" },
  { name: "Gripe Water", category: "Baby Care", brand: "Woodward's", manufacturer: "J&J", mrp: 75, sellingPrice: 68, discountPercent: 9, stock: 5, prescriptionRequired: false, packSize: "130ml" },

  { name: "Band-Aid Assorted Pack", category: "First Aid", brand: "Band-Aid", manufacturer: "J&J", mrp: 55, sellingPrice: 49, discountPercent: 11, stock: 90, prescriptionRequired: false, packSize: "20 strips" },
  { name: "Cotton Roll 100g", category: "First Aid", brand: "Medex Care", manufacturer: "Medex Pharmacy", mrp: 60, sellingPrice: 52, discountPercent: 13, stock: 60, prescriptionRequired: false },
  { name: "Antiseptic Cream", category: "First Aid", brand: "Soframycin", manufacturer: "Sanofi", mrp: 55, sellingPrice: 50, discountPercent: 9, stock: 40, prescriptionRequired: false, packSize: "30g" },
  { name: "Instant Ice Pack", category: "First Aid", brand: "Medex Care", manufacturer: "Medex Pharmacy", mrp: 90, sellingPrice: 79, discountPercent: 12, stock: 20, prescriptionRequired: false },

  { name: "Sunscreen SPF 50 Lotion", category: "Skin Care", brand: "Neutrogena", manufacturer: "J&J", mrp: 550, sellingPrice: 475, discountPercent: 14, stock: 30, prescriptionRequired: false, packSize: "88ml" },
  { name: "Moisturizing Body Lotion", category: "Skin Care", brand: "Cetaphil", manufacturer: "Galderma", mrp: 620, sellingPrice: 549, discountPercent: 11, stock: 28, prescriptionRequired: false, packSize: "473ml" },
  { name: "Acne Care Face Wash", category: "Skin Care", brand: "Clean & Clear", manufacturer: "J&J", mrp: 145, sellingPrice: 129, discountPercent: 11, stock: 55, prescriptionRequired: false, packSize: "100ml" },

  { name: "ORS Powder Sachets (Pack of 10)", category: "Digestive Health", brand: "Electral", manufacturer: "FDC", mrp: 60, sellingPrice: 55, discountPercent: 8, stock: 100, prescriptionRequired: false },
  { name: "Antacid Tablets", category: "Digestive Health", brand: "Digene", manufacturer: "Abbott", mrp: 40, sellingPrice: 36, discountPercent: 10, stock: 70, prescriptionRequired: false, packSize: "15 tablets" },
  { name: "Probiotic Capsules", category: "Digestive Health", brand: "Enterogermina", manufacturer: "Sanofi", mrp: 180, sellingPrice: 162, discountPercent: 10, stock: 8, prescriptionRequired: true, packSize: "10 capsules" },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  // Categories
  const categoryMap = {};
  for (const name of CATEGORIES) {
    const slug = slugify(name);
    const cat = await Category.findOneAndUpdate(
      { slug },
      { name, slug, status: "active" },
      { upsert: true, new: true }
    );
    categoryMap[name] = cat._id;
  }
  console.log(`Seeded ${CATEGORIES.length} categories.`);

  // Products
  let count = 0;
  for (const p of PRODUCTS) {
    const slug = slugify(p.name);
    await Product.findOneAndUpdate(
      { slug },
      {
        name: p.name,
        slug,
        brand: p.brand,
        manufacturer: p.manufacturer,
        category: categoryMap[p.category],
        composition: p.composition ?? "",
        packSize: p.packSize ?? "",
        mrp: p.mrp,
        sellingPrice: p.sellingPrice,
        discountPercent: p.discountPercent ?? 0,
        stockQuantity: p.stock,
        sku: `MDX-${slug.toUpperCase().slice(0, 12)}`,
        images: [PLACEHOLDER_IMAGE],
        prescriptionRequired: !!p.prescriptionRequired,
        status: "active",
        isDemo: true,
        description: `${p.name} — demo/sample product data for development. Not a real stock or medical recommendation.`,
      },
      { upsert: true, new: true }
    );
    count++;
  }
  console.log(`Seeded ${count} demo products (clearly marked isDemo: true).`);

  // Admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@medexpharmacy.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const hashed = await bcrypt.hash(adminPassword, 10);
  await User.findOneAndUpdate(
    { email: adminEmail },
    { name: "Medex Admin", email: adminEmail, password: hashed, role: "admin", provider: "credentials", status: "active" },
    { upsert: true, new: true }
  );
  console.log(`Admin user ready → email: ${adminEmail} / password: ${adminPassword} (CHANGE THIS after first login).`);

  // Sample coupon
  await Coupon.findOneAndUpdate(
    { code: "MEDICINE10" },
    {
      code: "MEDICINE10",
      discountType: "percentage",
      discountValue: 10,
      minOrderValue: 200,
      maxDiscount: 100,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
      usedCount: 0,
      status: "active",
    },
    { upsert: true, new: true }
  );
  console.log("Seeded coupon MEDICINE10 (10% off, min order ₹200, max discount ₹100).");

  // Store settings
  await Settings.findOneAndUpdate(
    { key: "store_settings" },
    {
      key: "store_settings",
      storeName: "Medex Pharmacy",
      address: "785 A, B Block, Panki, Kanpur",
      phone: "7084814251",
      whatsapp: "917084814251",
      upiId: "Medexpharmacy25@gmail.com",
      servicablePincodes: [],
      deliveryRadiusKm: 20,
      freeDeliveryThreshold: 499,
      standardDeliveryCharge: 40,
      codAvailable: "conditional",
      storePickupAvailable: true,
      openingHours: "9:00 AM – 10:00 PM, all days",
    },
    { upsert: true, new: true }
  );
  console.log("Store settings initialized.");

  console.log("\nSeed complete!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
