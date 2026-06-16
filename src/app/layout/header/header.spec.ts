import { TestBed } from '@angular/core/testing';
import { Header } from './header';
import { provideRouter } from '@angular/router';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])]
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

    const menuButton = fixture.nativeElement.querySelector('p-button[aria-label="Toggle sidebar"]') as HTMLElement;
    if (!menuButton) {
      // Fallback to querySelector('p-button') if selector compiles differently
      const fb = fixture.nativeElement.querySelector('p-button') as HTMLElement;
      fb.click();
    } else {
      menuButton.click();
    }

    expect(emittedSignal).toBe(true);
  });

  it('should list and filter modules based on search query', () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    // Set search query
    component.searchForm.get('query')?.setValue('Product');
    expect(component.searchQuery()).toBe('Product');
    expect(component.filteredModules().length).toBeGreaterThan(0);
    expect(component.filteredModules()[0].label).toContain('Product');
  });

  it('should have default company and branch selected', () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance;

    expect(component.selectedEmpresaId()).toBe(1);
    expect(component.selectedSucursalId()).toBe(1);
    expect(component.selectedEmpresa().nombre).toBe('Empresa 1');
    expect(component.selectedSucursal().nombre).toBe('Sucursal Principal');
  });
});
