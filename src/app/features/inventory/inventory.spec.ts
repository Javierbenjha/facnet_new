import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Inventory } from './inventory';

describe('Inventory', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inventory],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Inventory);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
