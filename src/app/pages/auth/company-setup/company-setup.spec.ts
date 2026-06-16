import { TestBed } from '@angular/core/testing';
import { CompanySetup } from './company_setup';

describe('CompanySetup', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySetup],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CompanySetup);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
