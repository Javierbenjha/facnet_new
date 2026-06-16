import { TestBed } from '@angular/core/testing';
import { Sale } from './sale';

describe('Sale', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sale],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Sale);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
