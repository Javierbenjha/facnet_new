import { TestBed } from '@angular/core/testing';
import { ReferralGuide } from './referral_guide';

describe('ReferralGuide', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralGuide],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReferralGuide);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
