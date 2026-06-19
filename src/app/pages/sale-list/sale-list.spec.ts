import { TestBed } from '@angular/core/testing';
import { SaleList } from './sale-list';

describe('SaleList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleList],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SaleList);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
