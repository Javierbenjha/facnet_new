import { TestBed } from '@angular/core/testing';
import { PurchaseList } from './purchase-list';

describe('PurchaseList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseList],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PurchaseList);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
