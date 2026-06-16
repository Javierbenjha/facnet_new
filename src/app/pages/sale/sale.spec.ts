import { TestBed } from '@angular/core/testing';
import { Sale } from './sale';
import { POS_PRODUCTOS } from './sale.models';

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
      c.addToCart(POS_PRODUCTOS[0]);
      expect(c.cart().length).toBe(1);
      expect(c.cart()[0].cantidad).toBe(1);
    });

    it('increments quantity when adding the same product twice', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(POS_PRODUCTOS[0]);
      c.addToCart(POS_PRODUCTOS[0]);
      expect(c.cart().length).toBe(1);
      expect(c.cart()[0].cantidad).toBe(2);
    });

    it('removes an item from the cart', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(POS_PRODUCTOS[0]);
      c.removeFromCart(POS_PRODUCTOS[0].id);
      expect(c.cart().length).toBe(0);
    });

    it('removes item when qty reaches 0 via changeQty', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(POS_PRODUCTOS[0]);
      c.changeQty(POS_PRODUCTOS[0].id, -1);
      expect(c.cart().length).toBe(0);
    });

    it('clears the cart', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(POS_PRODUCTOS[0]);
      c.addToCart(POS_PRODUCTOS[1]);
      c.clearCart();
      expect(c.cart().length).toBe(0);
    });
  });

  describe('totals', () => {
    it('computes subtotal, igv, and total correctly', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(POS_PRODUCTOS[0]); // precio_publico: 3.50
      c.addToCart(POS_PRODUCTOS[0]); // qty = 2 → 7.00
      expect(c.subtotal()).toBeCloseTo(7.00);
      expect(c.igv()).toBeCloseTo(7.00 * 0.18);
      expect(c.total()).toBeCloseTo(7.00 * 1.18);
    });
  });

  describe('confirmarPago', () => {
    it('saves last sale, increments ticket, clears cart, and shows ticket modal', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.addToCart(POS_PRODUCTOS[0]);
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

    it('filters products by query', () => {
      const fixture = TestBed.createComponent(Sale);
      const c = fixture.componentInstance;
      c.query.set('coca');
      expect(c.filteredProductos().some(p => p.descripcion.toLowerCase().includes('coca'))).toBe(true);
    });
  });
});
