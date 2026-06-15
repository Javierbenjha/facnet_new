import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { LayoutService } from '../layout.service';
import { NAV_SECTIONS } from '../nav.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  imports: [RouterLink, RouterLinkActive, TooltipModule]
})
export class Sidebar {
  protected readonly layout = inject(LayoutService);
  protected readonly sections = NAV_SECTIONS;
}
