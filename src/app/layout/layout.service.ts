import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly isSidebarCollapsed = signal(false);
  readonly isDark = signal(false);

  toggle(): void { this.isSidebarCollapsed.update(v => !v); }
  collapse(): void { this.isSidebarCollapsed.set(true); }
  expand(): void { this.isSidebarCollapsed.set(false); }

  toggleTheme(): void {
    this.isDark.update(v => !v);
    document.documentElement.classList.toggle('dark', this.isDark());
  }
}
