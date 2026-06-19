import { TestBed } from '@angular/core/testing';
import { CompanyBranch } from './company-branch';

describe('CompanyBranch', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyBranch],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CompanyBranch);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
