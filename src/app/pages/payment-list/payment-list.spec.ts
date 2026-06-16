import { TestBed } from '@angular/core/testing';
import { PaymentList } from './payment_list';

describe('PaymentList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentList],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PaymentList);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
