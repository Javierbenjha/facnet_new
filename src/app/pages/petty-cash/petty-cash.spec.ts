import { TestBed } from '@angular/core/testing';
import { PettyCash } from './petty_cash';

describe('PettyCash', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCash],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PettyCash);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
