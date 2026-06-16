export interface Producto {
  id:    string;
  sku:   string;
  name:  string;
  cat:   string;
  price: number;
  cost:  number;
  stock: number;
  unit:  string;
}

export const CATEGORIES = ['Todas', 'Bebidas', 'Panadería', 'Snacks', 'Lácteos', 'Café', 'Accesorios'];

export const BRANCHES = [
  { id: 'b1', name: 'Miraflores',      city: 'Lima'     },
  { id: 'b2', name: 'San Isidro',      city: 'Lima'     },
  { id: 'b3', name: 'Arequipa Centro', city: 'Arequipa' },
];

export const PRODUCTS: Producto[] = [
  { id: 'p01', sku: 'BEB-001', name: 'Agua mineral 500ml',      cat: 'Bebidas',    price: 4.50,  cost: 2.10,  stock: 184, unit: 'und' },
  { id: 'p02', sku: 'BEB-007', name: 'Jugo natural de naranja', cat: 'Bebidas',    price: 12.00, cost: 6.20,  stock: 42,  unit: 'und' },
  { id: 'p03', sku: 'CAF-012', name: 'Espresso doble',          cat: 'Café',       price: 9.50,  cost: 2.80,  stock: 999, unit: 'und' },
  { id: 'p04', sku: 'CAF-014', name: 'Latte vainilla',          cat: 'Café',       price: 14.00, cost: 4.30,  stock: 999, unit: 'und' },
  { id: 'p05', sku: 'CAF-016', name: 'Cold brew 12oz',          cat: 'Café',       price: 16.50, cost: 5.10,  stock: 999, unit: 'und' },
  { id: 'p06', sku: 'PAN-003', name: 'Croissant mantequilla',   cat: 'Panadería',  price: 7.50,  cost: 2.20,  stock: 38,  unit: 'und' },
  { id: 'p07', sku: 'PAN-009', name: 'Pan de chocolate',        cat: 'Panadería',  price: 8.00,  cost: 2.60,  stock: 24,  unit: 'und' },
  { id: 'p08', sku: 'PAN-011', name: 'Sandwich pavo',           cat: 'Panadería',  price: 18.00, cost: 7.40,  stock: 16,  unit: 'und' },
  { id: 'p09', sku: 'SNK-021', name: 'Barra granola artesanal', cat: 'Snacks',     price: 6.00,  cost: 2.00,  stock: 74,  unit: 'und' },
  { id: 'p10', sku: 'SNK-028', name: 'Mix frutos secos',        cat: 'Snacks',     price: 11.00, cost: 4.50,  stock: 52,  unit: 'und' },
  { id: 'p11', sku: 'LAC-004', name: 'Yogurt griego',           cat: 'Lácteos',    price: 9.00,  cost: 3.80,  stock: 28,  unit: 'und' },
  { id: 'p12', sku: 'LAC-006', name: 'Leche de almendras',      cat: 'Lácteos',    price: 13.50, cost: 5.60,  stock: 9,   unit: 'und' },
  { id: 'p13', sku: 'ACC-002', name: 'Taza cerámica branded',   cat: 'Accesorios', price: 29.00, cost: 11.00, stock: 33,  unit: 'und' },
  { id: 'p14', sku: 'ACC-005', name: 'Termo 500ml',             cat: 'Accesorios', price: 49.00, cost: 22.00, stock: 18,  unit: 'und' },
  { id: 'p15', sku: 'CAF-021', name: 'Bolsa café grano 250g',   cat: 'Café',       price: 38.00, cost: 14.00, stock: 62,  unit: 'und' },
  { id: 'p16', sku: 'BEB-015', name: 'Limonada de maracuyá',    cat: 'Bebidas',    price: 10.50, cost: 3.70,  stock: 40,  unit: 'und' },
];
