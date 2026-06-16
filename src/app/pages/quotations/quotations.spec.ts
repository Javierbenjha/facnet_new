import { TestBed } from '@angular/core/testing';
import { Quotations } from './quotations';

describe('Quotations', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quotations],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Quotations);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
