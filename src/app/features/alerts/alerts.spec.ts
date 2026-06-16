import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Alerts } from './alerts';

describe('Alerts', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alerts],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Alerts);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
