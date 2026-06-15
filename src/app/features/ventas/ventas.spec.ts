import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Ventas } from './ventas';

describe('Ventas', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ventas],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Ventas);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
