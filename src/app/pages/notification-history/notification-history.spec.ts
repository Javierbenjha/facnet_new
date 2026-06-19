import { TestBed } from '@angular/core/testing';
import { NotificationHistory } from './notification-history';

describe('NotificationHistory', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationHistory],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NotificationHistory);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
