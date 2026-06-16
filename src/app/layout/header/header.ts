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

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [FormsModule, Button, Select, InputText, IconField, InputIcon],
})
export class Header {
  private readonly router  = inject(Router);
  private readonly layout  = inject(Layout);

  readonly toggleSidebar = output<void>();

  readonly darkMode = this.layout.isDark;

  readonly selectedEmpresaId  = signal<number>(1);
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

  readonly searchQuery        = signal('');
  readonly showSearchDropdown = signal(false);

  readonly modules = computed(() => NAV_SECTIONS.flatMap(s => s.items));

  readonly filteredModules = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return [];
    return this.modules().filter(m => m.label.toLowerCase().includes(q));
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
}
