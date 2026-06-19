import { TestBed } from '@angular/core/testing';
import { PettyCashList } from './petty-cash-list';

describe('PettyCashList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashList],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PettyCashList);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
