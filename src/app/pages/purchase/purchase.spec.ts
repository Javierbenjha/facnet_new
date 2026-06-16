import { TestBed } from '@angular/core/testing';
import { Purchase } from './purchase';

describe('Purchase', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Purchase],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Purchase);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
