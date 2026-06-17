import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { NAV_SECTIONS, NavItem } from '../nav.config';
import { Layout } from '../layout';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Auth } from '../../core/services/auth';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [FormsModule, Button, Select, InputText, IconField, InputIcon, MenuModule],
})
export class Header {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly auth = inject(Auth);
  protected readonly currentUser = this.auth.currentUser;

  items: MenuItem[] | undefined;

  private readonly router = inject(Router);
  private readonly layout = inject(Layout);

  readonly toggleSidebar = output<void>();

  readonly darkMode = this.layout.isDark;

  readonly selectedEmpresaId = signal<number>(1);
  readonly selectedSucursalId = signal<number>(1);

  readonly empresas = signal([
    { id: 1, nombre: 'Andina Retail' },
    { id: 2, nombre: 'Norte S.A.C.' },
  ]);

  readonly sucursales = signal([
    { id: 1, nombre: 'Miraflores' },
    { id: 2, nombre: 'San Isidro' },
    { id: 3, nombre: 'Arequipa Centro' },
  ]);

  readonly searchQuery = signal('');
  readonly showSearchDropdown = signal(false);

  readonly modules = computed(() => NAV_SECTIONS.flatMap((s) => s.items));

  readonly filteredModules = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return [];
    return this.modules().filter((m) => m.label.toLowerCase().includes(q));
  });

  toggleDarkMode() {
    this.layout.toggleTheme();
  }

  onSearchInput(value: string) {
    this.searchQuery.set(value);
    this.showSearchDropdown.set(value.trim().length > 0);
  }

  selectModule(mod: NavItem) {
    this.router.navigate([mod.route]);
    this.searchQuery.set('');
    this.showSearchDropdown.set(false);
  }

  closeSearch() {
    setTimeout(() => this.showSearchDropdown.set(false), 150);
  }

  logout() {
    this.confirmationService.confirm({
      header: 'Cerrar sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cerrar sesión',
      rejectLabel: 'No, cancelar',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      accept: () => this.auth.logout().subscribe(() => this.router.navigate(['/login'])),
    });
  }

  constructor() {
    this.items = [
      { label: 'Perfil', icon: 'pi pi-user', command: () => this.router.navigate(['/profile']) },
      { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() },
    ];
  }
}
