// ============================================================
// KECH.GO — Tours Service & Utilities
// ============================================================

import { db } from "./firebase-config.js";
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ── DEMO TOURS (shown when Firestore is empty) ──
export const DEMO_TOURS = [
  {
    id: "demo-1",
    title: "Medina Magic: Old Marrakech Walking Tour",
    slug: "medina-magic-marrakech",
    shortDesc: "Explore the labyrinthine souks, hidden riads, and centuries-old architecture of the ancient medina with an expert local guide.",
    description: "Step into the heart of Marrakech's UNESCO World Heritage medina on this immersive 3-hour walking tour. Navigate the vibrant souks of leatherworkers, spice merchants, and carpet weavers. Discover the stunning Bahia Palace, the serene Saadian Tombs, and the iconic Djemaa el-Fna square. Your knowledgeable local guide shares centuries of history and insider secrets you won't find in any guidebook.",
    price: 45,
    currency: "USD",
    duration: "3 hours",
    location: "Marrakech Medina",
    category: "Cultural",
    rating: 4.9,
    reviewCount: 284,
    images: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80",
      "https://images.unsplash.com/photo-1548011241-9aa7ad72d1fc?w=800&q=80",
      "https://images.unsplash.com/photo-1570651200986-f0bc38600e3c?w=800&q=80"
    ],
    included: ["Expert local guide", "Entrance fees", "Mint tea tasting", "Map of medina"],
    excluded: ["Hotel pickup", "Gratuities", "Personal shopping"],
    highlights: ["Djemaa el-Fna square", "Bahia Palace", "Souks of Marrakech", "Saadian Tombs"],
    maxGroupSize: 12,
    languages: ["English", "French", "Arabic"],
    available: true,
    featured: true,
    approved: true,
    coordinates: { lat: 31.6258, lng: -7.9892 },
    createdAt: new Date()
  },
  {
    id: "demo-2",
    title: "Sahara Desert Sunset Camel Trek",
    slug: "sahara-camel-trek",
    shortDesc: "Ride through golden dunes at sunset and spend a magical night under a billion stars in a luxury Berber camp.",
    description: "Experience the romance of the Sahara on this unforgettable overnight camel trek departing from Merzouga. Ride majestic camels through towering Erg Chebbi dunes as the sun sets in spectacular colors. Arrive at your luxury Berber camp for a traditional dinner under the stars, with live music and dancing around the fire. Wake at dawn for sunrise over the dunes before returning by camel.",
    price: 189,
    currency: "USD",
    duration: "2 days",
    location: "Merzouga, Sahara",
    category: "Adventure",
    rating: 4.8,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
      "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80",
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800&q=80"
    ],
    included: ["Camel ride", "Luxury Berber camp", "Dinner & breakfast", "Stargazing guide", "Traditional music"],
    excluded: ["Transport to Merzouga", "Alcoholic beverages", "Personal expenses"],
    highlights: ["Erg Chebbi dunes", "Sunset camel ride", "Overnight camp", "Sunrise views"],
    maxGroupSize: 16,
    languages: ["English", "French", "Spanish"],
    available: true,
    featured: true,
    approved: true,
    coordinates: { lat: 31.0977, lng: -4.0137 },
    createdAt: new Date()
  },
  {
    id: "demo-3",
    title: "Atlas Mountains & Berber Villages Day Trip",
    slug: "atlas-mountains-berber",
    shortDesc: "Hike through breathtaking mountain landscapes and experience authentic Berber village life with local families.",
    description: "Journey from Marrakech to the majestic High Atlas Mountains for a day of hiking and cultural discovery. Trek through terraced valleys and traditional Berber villages where time seems to stand still. Share mint tea with local families in their homes, and learn about ancient Amazigh traditions and crafts. Enjoy a homemade Berber lunch with panoramic mountain views before returning to the city.",
    price: 75,
    currency: "USD",
    duration: "8 hours",
    location: "High Atlas Mountains",
    category: "Hiking",
    rating: 4.7,
    reviewCount: 198,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
      "https://images.unsplash.com/photo-1553789168-604080a5a13d?w=800&q=80",
      "https://images.unsplash.com/photo-1534131707746-25d604851a1f?w=800&q=80"
    ],
    included: ["Transport from Marrakech", "Expert guide", "Traditional lunch", "Village visit", "Mint tea ceremony"],
    excluded: ["Personal snacks", "Hiking boots", "Gratuities"],
    highlights: ["Ourika Valley", "Berber village homestay", "Mountain hiking", "Traditional lunch"],
    maxGroupSize: 10,
    languages: ["English", "French"],
    available: true,
    featured: false,
    approved: true,
    coordinates: { lat: 31.2171, lng: -7.9254 },
    createdAt: new Date()
  },
  {
    id: "demo-4",
    title: "Royal Cooking Class: Secrets of Moroccan Cuisine",
    slug: "moroccan-cooking-class",
    shortDesc: "Master the art of tagine, couscous, and pastilla in a traditional riad kitchen with a Marrakchi chef.",
    description: "Unlock the secrets of Moroccan gastronomy in this hands-on cooking class held in a stunning traditional riad. Begin with a guided tour of the spice markets to select fresh ingredients. Then cook alongside a master Marrakchi chef to prepare a full 4-course Moroccan feast including harira soup, bastilla, lamb tagine with preserved lemons, and honey-drenched pastries. Enjoy your creation for lunch with homemade mint tea.",
    price: 65,
    currency: "USD",
    duration: "4 hours",
    location: "Marrakech Riad",
    category: "Food & Drink",
    rating: 4.9,
    reviewCount: 312,
    images: [
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
    ],
    included: ["Market visit", "All ingredients", "Chef instruction", "4-course lunch", "Recipe booklet", "Mint tea"],
    excluded: ["Alcoholic drinks", "Hotel transfers"],
    highlights: ["Spice market tour", "Hands-on cooking", "4-course meal", "Recipes to take home"],
    maxGroupSize: 8,
    languages: ["English", "French", "Arabic"],
    available: true,
    featured: true,
    approved: true,
    coordinates: { lat: 31.6340, lng: -7.9927 },
    createdAt: new Date()
  },
  {
    id: "demo-5",
    title: "Hammam Ritual & Spa Experience",
    slug: "hammam-spa-ritual",
    shortDesc: "Indulge in an authentic Moroccan hammam steam bath, black soap scrub, and argan oil massage in a luxury spa.",
    description: "Surrender to the ultimate Moroccan wellness ritual at one of Marrakech's finest traditional hammams. Begin with a full steam bath in a marble chamber, followed by a vigorous black soap (beldi) scrub that leaves your skin glowing. Experience a rhassoul clay mask wrap, then drift into relaxation with a traditional argan oil massage. Complete your journey with a cold plunge, fresh orange juice, and rosewater pastries.",
    price: 95,
    currency: "USD",
    duration: "2.5 hours",
    location: "Marrakech Spa District",
    category: "Wellness",
    rating: 4.8,
    reviewCount: 97,
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      "https://images.unsplash.com/photo-1552693673-1bf958298935?w=800&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
    ],
    included: ["Steam bath", "Black soap scrub", "Rhassoul mask", "Argan massage", "Orange juice & pastries", "Towels & robe"],
    excluded: ["Hotel transfers", "Additional treatments"],
    highlights: ["Traditional hammam steam", "Black soap scrub", "Argan oil massage", "Complete relaxation"],
    maxGroupSize: 4,
    languages: ["English", "French", "Arabic"],
    available: true,
    featured: false,
    approved: true,
    coordinates: { lat: 31.6310, lng: -7.9836 },
    createdAt: new Date()
  },
  {
    id: "demo-6",
    title: "Essaouira Coastal Day Trip: The Blue Pearl",
    slug: "essaouira-day-trip",
    shortDesc: "Discover the magical coastal medina of Essaouira, a UNESCO World Heritage city of blue boats and ocean breezes.",
    description: "Escape Marrakech for a day in the enchanting port city of Essaouira, just 2.5 hours away. Explore the historic ramparts overlooking the crashing Atlantic, wander the blue and white medina streets lined with art galleries, and browse the fish market for the freshest catch. Enjoy a grilled seafood lunch by the harbor before a leisurely stroll through the wind-sculpted city that has captivated artists and travelers for centuries.",
    price: 55,
    currency: "USD",
    duration: "Full day",
    location: "Essaouira",
    category: "Day Trips",
    rating: 4.6,
    reviewCount: 143,
    images: [
      "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
    ],
    included: ["Comfortable transport", "Local guide", "Free time", "Seafood lunch"],
    excluded: ["Shopping", "Extra drinks", "Personal expenses"],
    highlights: ["UNESCO medina", "Ocean ramparts", "Fish market", "Art galleries"],
    maxGroupSize: 14,
    languages: ["English", "French"],
    available: true,
    featured: false,
    approved: true,
    coordinates: { lat: 31.5085, lng: -9.7595 },
    createdAt: new Date()
  }
];

// ── DEMO CATEGORIES ──
export const DEMO_CATEGORIES = [
  { id: "cultural", name: "Cultural", icon: "🏛️", count: 24, image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&q=80" },
  { id: "adventure", name: "Adventure", icon: "🏔️", count: 18, image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80" },
  { id: "food", name: "Food & Drink", icon: "🍽️", count: 15, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80" },
  { id: "wellness", name: "Wellness", icon: "🧖", count: 9, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80" },
  { id: "hiking", name: "Hiking", icon: "🥾", count: 12, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" },
  { id: "daytrips", name: "Day Trips", icon: "🚌", count: 21, image: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=400&q=80" }
];

// ── TOURS CRUD ──
export async function getTours(filters = {}) {
  try {
    let constraints = [];
    if (filters.category && filters.category !== "All") {
      constraints.push(where("category", "==", filters.category));
    }
    const q = constraints.length > 0
      ? query(collection(db, "tours"), ...constraints)
      : query(collection(db, "tours"));
    const snap = await getDocs(q);
    const tours = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Only use demo if Firestore is completely empty
    if (tours.length === 0) return DEMO_TOURS;
    return tours;
  } catch (e) {
    console.warn("Firestore unavailable, using demo tours:", e.message);
    return DEMO_TOURS;
  }
}

export async function getAllToursAdmin() {
  try {
    const snap = await getDocs(collection(db, "tours"));
    const tours = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (tours.length === 0) return DEMO_TOURS;
    return tours;
  } catch (e) {
    console.warn("Using demo tours:", e.message);
    return DEMO_TOURS;
  }
}

export async function getTourById(id) {
  try {
    const snap = await getDoc(doc(db, "tours", id));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return DEMO_TOURS.find(t => t.id === id) || null;
  } catch {
    return DEMO_TOURS.find(t => t.id === id) || null;
  }
}

export async function addTour(tourData) {
  const docRef = await addDoc(collection(db, "tours"), {
    ...tourData,
    rating: 0,
    reviewCount: 0,
    approved: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateTour(id, data) {
  await updateDoc(doc(db, "tours", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteTour(id) {
  await deleteDoc(doc(db, "tours", id));
}

// ── BOOKINGS ──
export async function createBooking(bookingData) {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...bookingData,
    status: "pending",
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function getAllBookings() {
  try {
    const snap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { return []; }
}

export async function getUserBookings(userId) {
  try {
    const snap = await getDocs(query(collection(db, "bookings"), where("userId", "==", userId), orderBy("createdAt", "desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { return []; }
}

export async function updateBookingStatus(id, status) {
  await updateDoc(doc(db, "bookings", id), { status, updatedAt: serverTimestamp() });
}

export async function deleteBooking(id) {
  await deleteDoc(doc(db, "bookings", id));
}

// ── USERS ──
export async function getAllUsers() {
  try {
    const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { return []; }
}

export async function updateUserRole(uid, role) {
  await updateDoc(doc(db, "users", uid), { role });
}

export async function deleteUser(uid) {
  await deleteDoc(doc(db, "users", uid));
}

// ── WISHLIST ──
export async function toggleWishlist(userId, tourId) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return false;
  const wishlist = snap.data().wishlist || [];
  const inList = wishlist.includes(tourId);
  await updateDoc(userRef, { wishlist: inList ? arrayRemove(tourId) : arrayUnion(tourId) });
  return !inList;
}

export async function getWishlist(userId) {
  try {
    const snap = await getDoc(doc(db, "users", userId));
    return snap.exists() ? (snap.data().wishlist || []) : [];
  } catch { return []; }
}

// ── REVIEWS ──
export async function getTourReviews(tourId) {
  try {
    const snap = await getDocs(query(collection(db, "reviews"), where("tourId", "==", tourId), orderBy("createdAt", "desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { return DEMO_REVIEWS.filter(r => r.tourId === tourId); }
}

export async function addReview(reviewData) {
  await addDoc(collection(db, "reviews"), { ...reviewData, createdAt: serverTimestamp() });
}

export async function getAllReviews() {
  try {
    const snap = await getDocs(query(collection(db, "reviews"), orderBy("createdAt", "desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { return DEMO_REVIEWS; }
}

export async function deleteReview(id) {
  await deleteDoc(doc(db, "reviews", id));
}

// ── DEMO REVIEWS ──
export const DEMO_REVIEWS = [
  { id: "r1", tourId: "demo-1", userName: "Sarah Mitchell", userPhoto: "", rating: 5, comment: "Absolutely incredible experience! Our guide Ahmed was knowledgeable, funny, and showed us hidden corners of the medina no tourist finds alone. The mint tea ceremony was magical.", createdAt: new Date("2024-12-15") },
  { id: "r2", tourId: "demo-1", userName: "Pierre Dubois", userPhoto: "", rating: 5, comment: "Parfait! The historical knowledge our guide shared was fascinating. Three hours felt like thirty minutes. Highly recommend for anyone visiting Marrakech.", createdAt: new Date("2024-12-10") },
  { id: "r3", tourId: "demo-2", userName: "James & Emma Carter", userPhoto: "", rating: 5, comment: "The most romantic night of our lives. Riding camels into the sunset over the dunes, dinner under a billion stars, waking to sunrise — pure magic. Worth every penny!", createdAt: new Date("2024-11-28") },
  { id: "r4", tourId: "demo-4", userName: "Yuki Tanaka", userPhoto: "", rating: 5, comment: "Chef Fatima was wonderful! We learned so much about Moroccan spices and techniques. The bastilla we made was better than any restaurant version I've had.", createdAt: new Date("2024-12-08") }
];

// ── UTILITIES ──
export function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = "★".repeat(full);
  if (half) stars += "½";
  stars += "☆".repeat(5 - full - (half ? 1 : 0));
  return stars;
}

export function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatPrice(price, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(price);
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
