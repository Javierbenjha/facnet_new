import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Purchases } from './purchases';

describe('Purchases', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Purchases],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Purchases);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
