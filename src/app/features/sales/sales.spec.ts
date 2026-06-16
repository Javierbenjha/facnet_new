import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Sales } from './sales';

describe('Sales', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sales],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Sales);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
