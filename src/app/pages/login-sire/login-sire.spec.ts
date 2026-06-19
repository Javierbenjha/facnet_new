import { TestBed } from '@angular/core/testing';
import { LoginSire } from './login-sire';

describe('LoginSire', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSire],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginSire);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
