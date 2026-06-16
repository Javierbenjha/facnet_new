import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { TopSlider } from '../top-slider/top-slider';
import { Layout } from '../layout';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  imports: [RouterOutlet, Header, Sidebar, TopSlider]
})
export class MainLayout {
  protected readonly layout = inject(Layout);

  protected toggleSidebar(): void {
    this.layout.toggle();
  }
}
