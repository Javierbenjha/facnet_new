import { TestBed } from '@angular/core/testing';
import { Collection } from './collection';

describe('Collection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Collection],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Collection);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
