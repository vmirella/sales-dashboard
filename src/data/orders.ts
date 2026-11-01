import { REFERENCE_DATE, addDays } from "@/lib/date-range";
import {
  PRODUCT_CATEGORIES,
  type Order,
  type OrderStatus,
  type ProductCategory,
} from "@/types/dashboard";

/**
 * Deterministic fake dataset.
 *
 * The data is generated with a seeded PRNG and a fixed reference date instead of
 * `Math.random()` / `Date.now()`. With Cache Components enabled, those calls are
 * not allowed while prerendering, and a deterministic dataset also keeps the demo
 * stable between deployments.
 */

const DAYS_OF_HISTORY = 180;
const SEED = 20261031;

const CUSTOMERS = [
  "Lucía Ramírez",
  "Mateo Quispe",
  "Valentina Flores",
  "Diego Castillo",
  "Camila Herrera",
  "Sebastián Vargas",
  "Isabella Rojas",
  "Joaquín Mendoza",
  "Renata Salazar",
  "Gabriel Paredes",
  "Fernanda Torres",
  "Nicolás Aguilar",
  "Daniela Chávez",
  "Andrés Medina",
  "Paula Navarro",
  "Rodrigo Silva",
  "Sofía Delgado",
  "Emilio Ríos",
  "Ximena Cárdenas",
  "Tomás Guerrero",
] as const;

const PRICE_RANGE_BY_CATEGORY: Record<ProductCategory, readonly [number, number]> = {
  electronics: [80, 650],
  fashion: [25, 180],
  home: [30, 320],
  beauty: [12, 95],
  sports: [20, 240],
};

/** Cumulative probabilities, evaluated in order. */
const STATUS_THRESHOLDS: ReadonlyArray<readonly [OrderStatus, number]> = [
  ["completed", 0.78],
  ["pending", 0.88],
  ["cancelled", 0.95],
  ["refunded", 1],
];

/** Small seeded PRNG (mulberry32). Returns a function that yields numbers in [0, 1). */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickStatus(roll: number): OrderStatus {
  const match = STATUS_THRESHOLDS.find(([, threshold]) => roll < threshold);
  return match ? match[0] : "completed";
}

function generateOrders(): Order[] {
  const random = createRandom(SEED);
  const firstDay = addDays(REFERENCE_DATE, -(DAYS_OF_HISTORY - 1));
  const orders: Order[] = [];

  for (let dayIndex = 0; dayIndex < DAYS_OF_HISTORY; dayIndex++) {
    const day = addDays(firstDay, dayIndex);
    const weekday = new Date(`${day}T00:00:00Z`).getUTCDay();

    // Gentle growth over time plus a weekend bump.
    const growth = 1 + (dayIndex / DAYS_OF_HISTORY) * 0.6;
    const weekendBoost = weekday === 0 || weekday === 5 || weekday === 6 ? 1.3 : 1;
    const ordersToday = Math.max(3, Math.round(9 * growth * weekendBoost + (random() - 0.5) * 5));

    for (let i = 0; i < ordersToday; i++) {
      const category = PRODUCT_CATEGORIES[Math.floor(random() * PRODUCT_CATEGORIES.length)];
      const [min, max] = PRICE_RANGE_BY_CATEGORY[category];
      const total = Math.round((min + random() * (max - min)) * 100) / 100;

      const hour = Math.floor(random() * 24);
      const minute = Math.floor(random() * 60);
      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`;

      orders.push({
        id: "",
        customer: CUSTOMERS[Math.floor(random() * CUSTOMERS.length)],
        category,
        status: pickStatus(random()),
        total,
        createdAt: `${day}T${time}`,
      });
    }
  }

  // Newest first, then assign stable, human-friendly ids.
  orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return orders.map((order, index) => ({
    ...order,
    id: `ORD-${String(orders.length - index).padStart(5, "0")}`,
  }));
}

export const orders: readonly Order[] = generateOrders();
