import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Inventario } from './inventario';

describe('Inventario', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inventario],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Inventario);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
