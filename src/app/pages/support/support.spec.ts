import { TestBed } from '@angular/core/testing';
import { Support } from './support';

describe('Support', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Support],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Support);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
