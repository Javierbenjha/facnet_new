import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { NgOptimizedImage } from '@angular/common';
import { Layout } from '../layout';
import { NAV_SECTIONS } from '../nav.config';
import { Auth } from '../../core/services/auth';
import { Menu } from '../../core/services/menu';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  imports: [RouterLink, RouterLinkActive, TooltipModule, NgOptimizedImage]
})
export class Sidebar {
  private readonly auth = inject(Auth);
  protected readonly currentUser = this.auth.currentUser;
  protected readonly layout = inject(Layout);
  protected readonly sections = NAV_SECTIONS;
  private readonly menu = inject(Menu);
  protected readonly modules = computed(() =>
  [...this.menu.modules().sort((a,b) => a.order - b.order)]
  )

  // Initials fallback when the user has no photo (nombre + apellido_paterno).
  protected readonly initials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    const first = user.nombre?.trim()?.[0] ?? '';
    const last = user.apellido_paterno?.trim()?.[0] ?? '';
    return (first + last).toUpperCase() || first.toUpperCase();
  });
}
