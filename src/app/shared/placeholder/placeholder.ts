import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  template: `
    <div class="p-8 text-center max-w-lg mx-auto mt-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg">
      <div class="flex justify-center pb-4 text-amber-500">
        <i class="pi pi-exclamation-triangle" style="font-size: 2.5rem"></i>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Módulo en Construcción</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Estamos trabajando en la migración de este módulo. Pronto estará disponible con la nueva arquitectura.</p>
      <div class="h-1 w-24 bg-cyan-600 mx-auto rounded-full"></div>
    </div>
  `,
  imports: []
})
export class Placeholder {}
