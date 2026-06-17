import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { Layout } from '../layout';
import { NAV_SECTIONS } from '../nav.config';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  imports: [RouterLink, RouterLinkActive, TooltipModule]
})
export class Sidebar {
  private readonly auth = inject(Auth);
  protected readonly currentUser = this.auth.currentUser;
  protected readonly layout = inject(Layout);
  protected readonly sections = NAV_SECTIONS;
}
