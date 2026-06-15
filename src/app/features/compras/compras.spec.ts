import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Compras } from './compras';

describe('Compras', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compras],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Compras);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
