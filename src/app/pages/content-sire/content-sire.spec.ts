import { TestBed } from '@angular/core/testing';
import { ContentSire } from './content_sire';

describe('ContentSire', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentSire],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContentSire);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
