import { TestBed } from '@angular/core/testing';
import { CashReport } from './cash-report';

describe('CashReport', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashReport],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CashReport);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
