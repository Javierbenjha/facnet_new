import { TestBed } from '@angular/core/testing';
import { Warranty } from './warranty';

describe('Warranty', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Warranty],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Warranty);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
