import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ColorPicker } from 'primeng/colorpicker';
import { Password } from 'primeng/password';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Cia, CompanyRequest } from '../../../core/models/company.model';
import { Sunat } from '../../../core/services/sunat';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Button, InputText, InputNumber, ToggleSwitch, ColorPicker, Password, AppModal],
})
export class CompanyForm {
  private readonly fb = inject(FormBuilder);
  private readonly sunat = inject(Sunat);

  readonly loadingRuc = signal(false);

  readonly editing = input<Cia | 'new' | null>(null);
  readonly closed  = output<void>();
  readonly saved   = output<CompanyRequest>();

  readonly visible = computed(() => this.editing() !== null);

  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    return e === 'new' ? 'Nueva empresa' : `Editar · ${(e as Cia).descripcion}`;
  });

  readonly logoVertical          = signal<File | null>(null);
  readonly logoHorizontal        = signal<File | null>(null);
  readonly logoVerticalPreview   = signal<string | null>(null);
  readonly logoHorizontalPreview = signal<string | null>(null);

  onLogoChange(event: Event, field: 'vertical' | 'horizontal') {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    const reader = new FileReader();
    if (field === 'vertical') {
      this.logoVertical.set(file);
      if (file) { reader.onload = e => this.logoVerticalPreview.set(e.target?.result as string); reader.readAsDataURL(file); }
      else this.logoVerticalPreview.set(null);
    } else {
      this.logoHorizontal.set(file);
      if (file) { reader.onload = e => this.logoHorizontalPreview.set(e.target?.result as string); reader.readAsDataURL(file); }
      else this.logoHorizontalPreview.set(null);
    }
  }

  removeLogo(field: 'vertical' | 'horizontal') {
    if (field === 'vertical') { this.logoVertical.set(null); this.logoVerticalPreview.set(null); }
    else { this.logoHorizontal.set(null); this.logoHorizontalPreview.set(null); }
  }

  // Azul por defecto. Sin '#' porque el colorpicker maneja el hex sin él; save() agrega el '#'.
  private readonly defaultColor = '3b82f6';

  readonly form = this.fb.nonNullable.group({
    ruc:           [''],
    descripcion:   [''],
    direccion:     [''],
    ubigeo:        [''],
    usuario_sol:   [''],
    clave_sol:     [''],
    ctedetra:      [''],
    monto700:      [700],
    limit_ret:     [700],
    monto_mensual: [0],
    monto_anual:   [0],
    stdetraccion:  [false],
    stretencion:   [false],
    color:         [this.defaultColor],
  });

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;
      if (e === 'new') {
        this.form.reset({
          ruc: '', descripcion: '', direccion: '', ubigeo: '',
          usuario_sol: '', clave_sol: '', ctedetra: '',
          monto700: 700, limit_ret: 700,
          monto_mensual: 0, monto_anual: 0,
          stdetraccion: false, stretencion: false,
          color: this.defaultColor,
        });
        this.logoVertical.set(null);
        this.logoHorizontal.set(null);
        this.logoVerticalPreview.set(null);
        this.logoHorizontalPreview.set(null);
        this.form.controls.descripcion.disable();
        this.form.controls.direccion.disable();
        this.form.controls.ubigeo.disable();
      } else {
        const emp = e as Cia;
        this.form.patchValue({
          ruc: emp.ruc, descripcion: emp.descripcion,
          direccion: emp.direccion, ubigeo: emp.ubigeo,
          usuario_sol: emp.usuario_sol, clave_sol: emp.clave_sol,
          ctedetra: emp.ctedetra,
          monto700: Number(emp.monto700), limit_ret: Number(emp.limit_ret),
          monto_mensual: Number(emp.monto_mensual), monto_anual: Number(emp.monto_anual),
          stdetraccion: emp.stdetraccion === 1, stretencion: emp.stretencion === 1,
          color: (emp.color ?? '').replace(/^#/, ''),
        });
        this.logoVertical.set(null);
        this.logoHorizontal.set(null);
        this.logoVerticalPreview.set(emp.logoVertical ?? null);
        this.logoHorizontalPreview.set(emp.logoHorizontal ?? null);
        this.form.controls.descripcion.disable();
        this.form.controls.direccion.disable();
        this.form.controls.ubigeo.disable();
      }
    });
  }

  buscarRuc() {
    const ruc = this.form.controls.ruc.value;
    if (ruc.length !== 11) return;
    this.loadingRuc.set(true);
    this.sunat.getByRuc(ruc).subscribe({
      next: (data) => {
        // SUNAT devuelve la razón social en `razon_social`; en nuestro modelo es `descripcion`.
        this.form.patchValue({
          descripcion: data.razon_social,
          direccion: data.direccion,
          ubigeo: data.ubigeo,
        });
        this.loadingRuc.set(false);
      },
      error: () => this.loadingRuc.set(false),
    });
  }

  save() {
    const v = this.form.getRawValue();
    const payload: CompanyRequest = {
      ruc: v.ruc,
      descripcion: v.descripcion,
      direccion: v.direccion,
      ubigeo: v.ubigeo,
      usuario_sol: v.usuario_sol,
      clave_sol: v.clave_sol,
      ctedetra: v.ctedetra,
      monto700: v.monto700,
      limit_ret: v.limit_ret,
      monto_mensual: v.monto_mensual,
      monto_anual: v.monto_anual,
      stdetraccion: v.stdetraccion ? 1 : 0,
      stretencion: v.stretencion ? 1 : 0,
      color: v.color ? `#${v.color.replace(/^#/, '')}` : '',
    };
    const lv = this.logoVertical();
    const lh = this.logoHorizontal();
    if (lv) payload.logo_vertical = lv;
    if (lh) payload.logo_horizontal = lh;
    this.saved.emit(payload);
    this.closed.emit();
  }

  close() { this.closed.emit(); }
}
