import { TestBed } from '@angular/core/testing';
import { Alertas } from './alertas';

describe('Alertas', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alertas],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Alertas);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
