import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">Roles</h1>
      <p class="text-surface-500 dark:text-surface-400 mt-2">Módulo en construcción.</p>
    </div>
  `,
})
export class Roles {}
