import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Catalogs } from './catalogs';

describe('Catalogs', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catalogs],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Catalogs);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
