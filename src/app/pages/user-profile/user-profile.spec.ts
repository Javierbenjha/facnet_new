import { TestBed } from '@angular/core/testing';
import { UserProfile } from './user_profile';

describe('UserProfile', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfile],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserProfile);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
