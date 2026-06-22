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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Rbac } from '../../../core/services/rbac';

@Component({
  selector: 'app-role-form',
  imports: [AppModal, ReactiveFormsModule, Button, InputText],
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
  readonly scopeOptions = [
    { label: 'Propios', value: 'own' },
    { label: 'Sucursal', value: 'branch' },
    { label: 'Todos', value: 'all' },
  ];

  isChecked(id: string): boolean {
    return id in this.selected();
  }

  toggle(id: string): void {
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

  readonly grouped = computed(() => {
    const groups: Record<string, Permission[]> = {};

    for (const perm of this.permissions()) {
      (groups[perm.module] ??= []).push(perm);
    }
    return Object.entries(groups).map(([module, items]) => ({ module, items }));
  });

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  constructor() {
    this.rbac.listPermissions().subscribe((permissions) => this.permissions.set(permissions));

    effect(() => {
      if (!this.editing()) return;

      if (this.editing() === 'new') {
        this.form.reset({
          name: '',
          description: '',
        });
        this.selected.set({});
      } else {
        const p = this.editing() as RoleDetail;
        this.form.patchValue({
          name: p.name,
          description: p.description || '',
        });

        // ← reconstruir la selección desde los permisos del rol
        const sel: Record<string, Scope> = {};
        for (const perm of p.permissions) {
          sel[perm.permissionId] = perm.scope;
        }
        this.selected.set(sel);
      }
    });
  }
  close() {
    this.closed.emit();
  }
  save() {

    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const payload: SaveRolePayload = {
      name: v.name,
      description: v.description || undefined,
      permissions: Object.entries(this.selected()).map(
        ([permissionId,scope]) => ({permissionId,scope}),
      ),
    };

    const editing = this.editing();
    const request$ = editing && editing !== 'new'
    ? this.rbac.update(editing.id, payload) : this.rbac.create(payload);

    request$.subscribe(() => this.saved.emit());
  }
}
