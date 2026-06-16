import { Component, computed, signal } from '@angular/core';
import { User, USERS } from './users.models';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  readonly users = signal<User[]>(USERS);
  readonly editing = signal<User | 'new' | null>(null);

  readonly kpis = computed(() => {
    const ps = this.users();
    return {
      total: ps.length,
      activos: ps.filter((u) => u.estado === 'ACTIVO').length,
      admins: ps.filter((u) => u.rol === 'Admin').length,
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
