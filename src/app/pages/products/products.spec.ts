import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Products } from './products';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, Products],
    }).compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list initial products', () => {
    expect(component.products().length).toBeGreaterThan(0);
  });

  it('should filter products by query', () => {
    component.query.set('Agua');
    const filtered = component.filteredProducts();
    expect(filtered.every(p => p.name.toLowerCase().includes('agua') || p.sku.toLowerCase().includes('agua'))).toBe(true);
  });
});
