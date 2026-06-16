import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { User, USERS } from './users.models';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './users.scss',
})

export class Users {
  readonly users = signal<User[]>(USERS);
  readonly editing = signal<User | 'new' | null>(null);

  readonly kpis = computed(() => {
    const us = this.users();
    return {
      total: us.length,
      activos: us.filter((u) => u.estado === 'ACTIVO').length,
      admins: us.filter((u) => u.rol === 'Admin').length,
      inactivos: us.filter((u) => u.estado === 'INACTIVO').length
    };
  });
  
  openNew() {
    this.editing.set('new');
  }
  openEdit(p: User) {
    this.editing.set(p);
  }
  closeModal() {
    this.editing.set(null);
  }
}
