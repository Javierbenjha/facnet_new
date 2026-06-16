import { TestBed } from '@angular/core/testing';
import { UserRegistration } from './user_registration';

describe('UserRegistration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRegistration],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserRegistration);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
