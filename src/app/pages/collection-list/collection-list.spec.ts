import { TestBed } from '@angular/core/testing';
import { CollectionList } from './collection-list';

describe('CollectionList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionList],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CollectionList);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
