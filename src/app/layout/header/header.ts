import { Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [ButtonModule]
})
export class Header {
  readonly toggleSidebar = output<void>();
}
