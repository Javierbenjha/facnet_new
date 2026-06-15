import { TestBed } from '@angular/core/testing';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should emit toggleSidebar event when menu button is clicked', () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance;

    let emittedSignal = false;
    component.toggleSidebar.subscribe(() => {
      emittedSignal = true;
    });

    const menuButton = fixture.nativeElement.querySelector('button[aria-label="Toggle sidebar"]');
    menuButton.click();

    expect(emittedSignal).toBe(true);
  });
});
