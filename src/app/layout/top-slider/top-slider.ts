import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

interface SliderItem {
  name: string;
  logo?: string;
  url?: string;
}

@Component({
  selector: 'app-top-slider',
  templateUrl: './top-slider.html',
  imports: [NgOptimizedImage],
  host: { 'class': 'flex w-full h-8 bg-primary dark:bg-stone-950 overflow-hidden shrink-0' },
})
export class TopSlider {
  readonly items: SliderItem[] = [
    { name: 'HARD SYSTEM PERU S.A.C. — Todos los derechos reservados.', logo: 'assets/images/logo.png' },
    { name: '¿Necesitás ayuda? Visitá el área de soporte.', url: '/soporte' },
    { name: 'Sistema de gestión empresarial · Versión Beta 0.1' },
  ];
}
