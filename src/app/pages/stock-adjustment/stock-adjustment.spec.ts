import { TestBed } from '@angular/core/testing';
import { StockAdjustment } from './stock-adjustment';

describe('StockAdjustment', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAdjustment],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StockAdjustment);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
