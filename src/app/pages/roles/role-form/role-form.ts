import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Permission, RoleDetail, SaveRolePayload, Scope } from '../roles.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { Select } from 'primeng/select';
import { Rbac } from '../../../core/services/rbac';

interface PermissionGroup {
  module: string;
  wildcard?: Permission;
  items: Permission[];
}

@Component({
  selector: 'app-role-form',
  imports: [AppModal, ReactiveFormsModule, FormsModule, Button, InputText, Checkbox, Select],
  templateUrl: './role-form.html',
  styleUrl: './role-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleForm {
  readonly editing = input<RoleDetail | 'new' | null>(null);
  readonly visible = computed(() => this.editing() !== null);
  private readonly fb = inject(FormBuilder);
  readonly modalTitle = computed(() => (this.editing() === 'new' ? 'Nuevo rol' : 'Editar rol'));
  readonly closed = output<void>();
  readonly saved = output<void>();
  readonly selected = signal<Record<string, Scope>>({});
  private readonly rbac = inject(Rbac);
  readonly permissions = signal<Permission[]>([]);
  readonly errors = signal<string[]>([]);
  readonly permError = signal(false);
  readonly scopeOptions = [
    { label: 'Propios', value: 'own' },
    { label: 'Sucursal', value: 'branch' },
    { label: 'Todos', value: 'all' },
  ];

  isChecked(id: string): boolean {
    return id in this.selected();
  }

  toggle(id: string): void {
    this.permError.set(false);
    this.selected.update((current) => {
      const next = { ...current };
      if (id in next) delete next[id];
      else next[id] = 'own';
      return next;
    });
  }

  setScope(id: string, scope: Scope): void {
    this.selected.update((current) => ({ ...current, [id]: scope }));
  }

  scopeOf(id: string): Scope | undefined {
    return this.selected()[id];
  }

  // --- "Todas las acciones" master (UI only — never sent as the wildcard) ---

  allChecked(items: Permission[]): boolean {
    return items.length > 0 && items.every((p) => this.isChecked(p.id));
  }

  someChecked(items: Permission[]): boolean {
    return items.some((p) => this.isChecked(p.id));
  }

  toggleAll(items: Permission[]): void {
    this.permError.set(false);
    const turnOn = !this.allChecked(items);
    this.selected.update((current) => {
      const next = { ...current };
      for (const p of items) {
        if (turnOn) next[p.id] ??= 'own';
        else delete next[p.id];
      }
      return next;
    });
  }

  /** Scope shared by every selected child of a module, or undefined if they differ. */
  commonScope(items: Permission[]): Scope | undefined {
    const scopes = items.map((p) => this.scopeOf(p.id)).filter((s): s is Scope => !!s);
    if (scopes.length === 0) return undefined;
    return scopes.every((s) => s === scopes[0]) ? scopes[0] : undefined;
  }

  setScopeAll(items: Permission[], scope: Scope): void {
    this.selected.update((current) => {
      const next = { ...current };
      for (const p of items) {
        if (p.id in next) next[p.id] = scope;
      }
      return next;
    });
  }

  readonly grouped = computed<PermissionGroup[]>(() => {
    const groups: Record<string, PermissionGroup> = {};
    for (const perm of this.permissions()) {
      const group = (groups[perm.module] ??= { module: perm.module, items: [] });
      if (perm.action === '*') group.wildcard = perm;
      else group.items.push(perm);
    }
    return Object.values(groups);
  });

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  constructor() {
    this.rbac.listPermissions().subscribe((permissions) => this.permissions.set(permissions));

    effect(() => {
      const editing = this.editing();
      if (!editing) return;

      this.errors.set([]);
      this.permError.set(false);

      if (editing === 'new') {
        this.form.reset({ name: '', description: '' });
        this.selected.set({});
        return;
      }

      const perms = this.permissions();
      if (perms.length === 0) return; // wait until the catalog is loaded

      this.form.patchValue({ name: editing.name, description: editing.description || '' });

      // Reconstruct selection. A stored wildcard (modulo.*) expands to its children.
      const sel: Record<string, Scope> = {};
      for (const rp of editing.permissions) {
        const meta = perms.find((p) => p.id === rp.permissionId);
        if (meta?.action === '*') {
          for (const child of perms) {
            if (child.module === meta.module && child.action !== '*') sel[child.id] = rp.scope;
          }
        } else {
          sel[rp.permissionId] = rp.scope;
        }
      }
      this.selected.set(sel);
    });
  }

  close() {
    this.closed.emit();
  }

  save() {
    this.errors.set([]);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const permissions = Object.entries(this.selected()).map(([permissionId, scope]) => ({
      permissionId,
      scope,
    }));

    if (permissions.length === 0) {
      this.permError.set(true);
      return;
    }

    const v = this.form.getRawValue();
    const payload: SaveRolePayload = {
      name: v.name,
      description: v.description || undefined,
      permissions,
    };

    const editing = this.editing();
    const request$ =
      editing && editing !== 'new'
        ? this.rbac.update(editing.id, payload)
        : this.rbac.create(payload);

    request$.subscribe({
      next: () => this.saved.emit(),
      error: (e: HttpErrorResponse) => {
        const message = e.error?.message;
        this.errors.set(
          Array.isArray(message)
            ? message
            : [message ?? 'No se pudo guardar el rol. Intentá de nuevo.'],
        );
      },
    });
  }
}
