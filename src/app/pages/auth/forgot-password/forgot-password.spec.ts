import { TestBed } from '@angular/core/testing';
import { ForgotPassword } from './forgot-password';

describe('ForgotPassword', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPassword],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ForgotPassword);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
