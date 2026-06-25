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
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Users } from '../../../core/services/users';
import { Branch } from '../../../core/services/branch';
import { Rbac } from '../../../core/services/rbac';
import { Auth } from '../../../core/services/auth';
import { Toaster } from '../../../core/services/toast';
import { Sucursal } from '../../../core/models/branch.model';
import { RoleListItem } from '../../roles/roles.model';
import {
  CreateUserPayload,
  UpdateUserPayload,
  UserDetail,
} from '../users.model';

interface AssignmentRow {
  sucursalId: string;
  roleId: string;
}

@Component({
  selector: 'app-user-form',
  imports: [AppModal, ReactiveFormsModule, FormsModule, Button, InputText, Select],
  templateUrl: './user-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  private readonly fb = inject(FormBuilder);
  private readonly users = inject(Users);
  private readonly branch = inject(Branch);
  private readonly rbac = inject(Rbac);
  private readonly auth = inject(Auth);
  private readonly toaster = inject(Toaster);

  readonly editing = input<UserDetail | 'new' | null>(null);
  readonly closed = output<void>();
  readonly saved = output<void>();

  readonly visible = computed(() => this.editing() !== null);
  readonly isNew = computed(() => this.editing() === 'new');
  readonly isOwner = computed(() => this.auth.currentUser()?.role === 1);
  readonly modalTitle = computed(() => (this.isNew() ? 'Nuevo usuario' : 'Editar usuario'));

  readonly sucursales = signal<Sucursal[]>([]);
  readonly roles = signal<RoleListItem[]>([]);
  readonly assignments = signal<AssignmentRow[]>([]);
  readonly imagen = signal<File | null>(null);
  readonly preview = signal<string | null>(null);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido_paterno: ['', Validators.required],
    apellido_materno: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    password: [''],
  });

  constructor() {
    this.branch.getBranches().subscribe((s) => this.sucursales.set(s));
    this.rbac.listRoles().subscribe((r) => this.roles.set(r));

    effect(() => {
      const e = this.editing();
      if (!e) return;

      const pwd = this.form.controls.password;
      const email = this.form.controls.email;

      if (e === 'new') {
        // Crear: email editable, password obligatorio.
        pwd.setValidators([Validators.required, Validators.minLength(6)]);
        email.enable();
        this.form.reset({
          nombre: '',
          apellido_paterno: '',
          apellido_materno: '',
          email: '',
          telefono: '',
          password: '',
        });
        this.assignments.set([{ sucursalId: '', roleId: '' }]);
        this.imagen.set(null);
        this.preview.set(null);
      } else {
        // Editar: email inmutable, password opcional (min 6 si se escribe).
        pwd.setValidators([Validators.minLength(6)]);
        this.form.patchValue({
          nombre: e.nombre,
          apellido_paterno: e.apellido_paterno,
          apellido_materno: e.apellido_materno,
          email: e.email,
          telefono: e.telefono ?? '',
          password: '',
        });
        email.disable();
        this.assignments.set(
          e.assignments.map((a) => ({ sucursalId: a.sucursalId, roleId: a.roleId })),
        );
        this.imagen.set(null);
        this.preview.set(e.imagen);
      }
      pwd.updateValueAndValidity();
    });
  }

  addRow(): void {
    this.assignments.update((rows) => [...rows, { sucursalId: '', roleId: '' }]);
  }

  removeRow(index: number): void {
    this.assignments.update((rows) => rows.filter((_, i) => i !== index));
  }

  setSucursal(index: number, sucursalId: string): void {
    this.assignments.update((rows) =>
      rows.map((r, i) => (i === index ? { ...r, sucursalId } : r)),
    );
  }

  setRol(index: number, roleId: string): void {
    this.assignments.update((rows) => rows.map((r, i) => (i === index ? { ...r, roleId } : r)));
  }

  onFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.imagen.set(file);
    this.preview.set(URL.createObjectURL(file));
  }

  close(): void {
    this.closed.emit();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const filled = this.assignments().filter((r) => r.sucursalId && r.roleId);

    // El editor de asignaciones solo aplica al dueño.
    if (this.isOwner()) {
      if (!filled.length) {
        this.toaster.warning('Asignaciones', 'Asigná al menos una sucursal con su rol');
        return;
      }
      const sucursales = filled.map((r) => r.sucursalId);
      if (new Set(sucursales).size !== sucursales.length) {
        this.toaster.error('Asignaciones', 'No podés repetir la misma sucursal');
        return;
      }
    }

    const ciaId = this.auth.activeCompany()?.id ?? '';
    const v = this.form.getRawValue();
    this.saving.set(true);

    if (this.isNew()) {
      const payload: CreateUserPayload = {
        nombre: v.nombre,
        apellido_paterno: v.apellido_paterno,
        apellido_materno: v.apellido_materno,
        email: v.email,
        password: v.password,
        telefono: v.telefono || undefined,
        ciaId,
        assignments: filled,
        imagen: this.imagen() ?? undefined,
      };
      this.users.create(payload).subscribe({
        next: () => this.onSuccess(),
        error: (err) => this.onError(err),
      });
      return;
    }

    const id = (this.editing() as UserDetail).id;
    const basic: UpdateUserPayload = {
      nombre: v.nombre,
      apellido_paterno: v.apellido_paterno,
      apellido_materno: v.apellido_materno,
      telefono: v.telefono || undefined,
      password: v.password || undefined,
      imagen: this.imagen() ?? undefined,
    };

    const request$: Observable<unknown> = this.isOwner()
      ? this.users
          .update(id, basic)
          .pipe(switchMap(() => this.users.updateAssignments(id, { ciaId, assignments: filled })))
      : this.users.update(id, basic);

    request$.subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err),
    });
  }

  private onSuccess(): void {
    this.saving.set(false);
    this.toaster.success('Listo', this.isNew() ? 'Usuario creado' : 'Usuario actualizado');
    this.saved.emit();
  }

  private onError(err: { error?: { message?: string | string[] } }): void {
    this.saving.set(false);
  
    const raw = err.error?.message;
    const message = Array.isArray(raw) ? raw.join(' ') : raw;
    this.toaster.error('Error', message ?? 'No se pudo guardar el usuario');
  }
}
