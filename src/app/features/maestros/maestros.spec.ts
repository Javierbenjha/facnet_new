import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Maestros } from './maestros';

describe('Maestros', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maestros],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Maestros);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
