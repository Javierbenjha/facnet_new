import { TestBed } from '@angular/core/testing';
import { ReferralGuideList } from './referral_guide_list';

describe('ReferralGuideList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralGuideList],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReferralGuideList);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
