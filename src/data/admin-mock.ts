export type AdminCategory = { id: number; name: string; products: number; updated: string };
export type AdminDiscount = { id: number; name: string; code: string; type: "Percentage" | "Fixed amount"; value: string; status: "Active" | "Scheduled" | "Expired"; ends: string };
export type AdminOrder = { id: string; customer: string; items: number; total: string; status: "Pending" | "Paid" | "Shipped" | "Completed"; date: string };
export type AdminCustomer = { id: string; name: string; email: string; orders: number; spent: string; status: "Active" | "Inactive"; joined: string };

export const adminProducts = [
  { id: "demo-1", name: "Batik Heritage Tote", description: "Hand-finished batik tote.", price: "1850000", discount: "0", categories: { id: 1, name: "Tote" }, badges: { id: 2, name: "BESTSELLER" }, product_images: [], product_colors: [{ id: 1, name: "Terracotta", hex_code: "#c96b52", stock: 8 }] },
  { id: "demo-2", name: "Rattan Market Carryall", description: "Woven rattan carryall.", price: "2400000", discount: "200000", categories: { id: 1, name: "Tote" }, badges: { id: 1, name: "LIMITED" }, product_images: [], product_colors: [{ id: 2, name: "Natural", hex_code: "#c8a882", stock: 3 }] },
  { id: "demo-3", name: "Java Evening Crossbody", description: "Compact evening crossbody.", price: "1250000", discount: "0", categories: { id: 2, name: "Crossbody" }, badges: null, product_images: [], product_colors: [{ id: 3, name: "Black", hex_code: "#202020", stock: 12 }] },
];

export const adminCategories: AdminCategory[] = [
  { id: 1, name: "Tote", products: 12, updated: "Today" },
  { id: 2, name: "Crossbody", products: 8, updated: "Yesterday" },
  { id: 3, name: "Shoulder", products: 6, updated: "Aug 28, 2026" },
  { id: 4, name: "Backpacks", products: 4, updated: "Aug 22, 2026" },
  { id: 5, name: "Clutches", products: 3, updated: "Aug 18, 2026" },
];

export const adminDiscounts: AdminDiscount[] = [
  { id: 1, name: "Independence Week", code: "MERDEKA15", type: "Percentage", value: "15%", status: "Active", ends: "Sep 17, 2026" },
  { id: 2, name: "First order welcome", code: "WELCOME100K", type: "Fixed amount", value: "Rp 100.000", status: "Active", ends: "Dec 31, 2026" },
  { id: 3, name: "Weekend preview", code: "WEEKEND20", type: "Percentage", value: "20%", status: "Scheduled", ends: "Sep 20, 2026" },
  { id: 4, name: "Ramadan edit", code: "RAMADAN25", type: "Percentage", value: "25%", status: "Expired", ends: "Apr 30, 2026" },
];

export const adminOrders: AdminOrder[] = [
  { id: "MB-1048", customer: "Alya Pranoto", items: 2, total: "Rp 4.250.000", status: "Pending", date: "Sep 03, 2026" },
  { id: "MB-1047", customer: "Nadine Wijaya", items: 1, total: "Rp 1.850.000", status: "Paid", date: "Sep 02, 2026" },
  { id: "MB-1046", customer: "Raka Santoso", items: 3, total: "Rp 6.200.000", status: "Shipped", date: "Sep 02, 2026" },
  { id: "MB-1045", customer: "Maya Kusuma", items: 1, total: "Rp 2.100.000", status: "Completed", date: "Sep 01, 2026" },
  { id: "MB-1044", customer: "Dimas Putra", items: 2, total: "Rp 3.700.000", status: "Paid", date: "Aug 31, 2026" },
];

export const adminCustomers: AdminCustomer[] = [
  { id: "CUS-201", name: "Alya Pranoto", email: "alya@example.com", orders: 8, spent: "Rp 14.850.000", status: "Active", joined: "Jan 12, 2026" },
  { id: "CUS-200", name: "Nadine Wijaya", email: "nadine@example.com", orders: 4, spent: "Rp 7.240.000", status: "Active", joined: "Feb 04, 2026" },
  { id: "CUS-199", name: "Raka Santoso", email: "raka@example.com", orders: 2, spent: "Rp 6.200.000", status: "Active", joined: "Mar 18, 2026" },
  { id: "CUS-198", name: "Maya Kusuma", email: "maya@example.com", orders: 1, spent: "Rp 2.100.000", status: "Inactive", joined: "Jun 09, 2026" },
];
