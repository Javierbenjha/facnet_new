import { TestBed } from '@angular/core/testing';
import { CustomersSuppliers } from './customers-suppliers';

describe('CustomersSuppliers', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersSuppliers],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CustomersSuppliers);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
