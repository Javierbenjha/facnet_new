import { TestBed } from '@angular/core/testing';
import { SmsVerification } from './sms_verification';

describe('SmsVerification', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsVerification],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SmsVerification);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
