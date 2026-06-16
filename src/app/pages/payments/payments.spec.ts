import { TestBed } from '@angular/core/testing';
import { Payments } from './payments';

describe('Payments', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Payments],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Payments);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
