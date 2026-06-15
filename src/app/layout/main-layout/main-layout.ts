import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  imports: [RouterOutlet, Header, Sidebar]
})
export class MainLayout {
  protected readonly layout = inject(LayoutService);

  protected toggleSidebar(): void {
    this.layout.toggle();
  }
}
