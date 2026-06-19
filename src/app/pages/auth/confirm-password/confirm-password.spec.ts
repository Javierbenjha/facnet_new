import { TestBed } from '@angular/core/testing';
import { ConfirmPassword } from './confirm-password';

describe('ConfirmPassword', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPassword],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ConfirmPassword);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
