import { TestBed } from '@angular/core/testing';
import { Sale } from './sale';
import { PosProducto } from './sale.models';

const PROD_A: PosProducto = {
  id: '1', sku: 'TST001', descripcion: 'Producto A', categoria: 'Test',
  precio_publico: 3.50, precio_publico_soles: 3.50, precio_publico_dolar: 1.00,
  precio_mayor_soles: 3.00, precio_mayor_dolar: 0.86,
  precio_costo: 2.00, precio_min: 2.00, stock: 10,
  color: 'bg-red-100', st_afecto: 1, tipoMoneda: 1,
};

const PROD_B: PosProducto = {
  id: '2', sku: 'TST002', descripcion: 'Producto B', categoria: 'Bebidas',
  precio_publico: 5.00, precio_publico_soles: 5.00, precio_publico_dolar: 1.43,
  precio_mayor_soles: 4.50, precio_mayor_dolar: 1.29,
  precio_costo: 3.00, precio_min: 3.00, stock: 5,
  color: 'bg-blue-100', st_afecto: 1, tipoMoneda: 1,
};

describe('Sale', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sale],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Sale);
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('cart', () => {
    it('adds a product to the cart', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(PROD_A);
      expect(c.cart().length).toBe(1);
      expect(c.cart()[0].cantidad).toBe(1);
    });

    it('increments quantity when adding the same product twice', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(PROD_A);
      c.addToCart(PROD_A);
      expect(c.cart().length).toBe(1);
      expect(c.cart()[0].cantidad).toBe(2);
    });

    it('removes an item from the cart', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(PROD_A);
      c.removeFromCart(PROD_A.id);
      expect(c.cart().length).toBe(0);
    });

    it('removes item when qty reaches 0 via changeQty', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(PROD_A);
      c.changeQty(PROD_A.id, -1);
      expect(c.cart().length).toBe(0);
    });

    it('clears the cart', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(PROD_A);
      c.addToCart(PROD_B);
      c.clearCart();
      expect(c.cart().length).toBe(0);
    });
  });

  describe('totals', () => {
    it('computes subtotal, igv, and total correctly', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(PROD_A); // 3.50
      c.addToCart(PROD_A); // qty = 2 → 7.00
      expect(c.subtotal()).toBeCloseTo(7.00);
      expect(c.igv()).toBeCloseTo(7.00 * 0.18);
      expect(c.total()).toBeCloseTo(7.00 * 1.18);
    });
  });

  describe('confirmarPago', () => {
    it('saves last sale, increments ticket, clears cart, and shows ticket modal', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(PROD_A);
      const totalBefore = c.total();
      c.confirmarPago();
      expect(c.cart().length).toBe(0);
      expect(c.ticketNum()).toBe(2);
      expect(c.lastSale()?.total).toBeCloseTo(totalBefore);
      expect(c.showTicket()).toBe(true);
      expect(c.showPago()).toBe(false);
    });
  });

  describe('filtering', () => {
    it('filters products by category', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.catActiva.set('Bebidas');
      expect(c.filteredProductos().every(p => p.categoria === 'Bebidas')).toBe(true);
    });
  });
});
