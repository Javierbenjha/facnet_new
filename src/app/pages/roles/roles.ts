import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Rbac } from '../../core/services/rbac';
import { RoleListItem } from './roles.model';

@Component({
  selector: 'app-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roles.html',
})
export class Roles {
  private readonly rbac = inject(Rbac);

  readonly roles = signal<RoleListItem[]>([]);

  constructor() {
    this.rbac.listRoles().subscribe((roles) => this.roles.set(roles));
  }
}
