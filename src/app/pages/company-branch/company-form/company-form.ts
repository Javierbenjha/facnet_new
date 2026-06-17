import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { AppModal } from '../../../shared/app-modal/app-modal';
import { Empresa } from '../company-branch.models';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Button, InputText, InputNumber, ToggleSwitch, AppModal],
})
export class CompanyForm {
  private readonly fb = inject(FormBuilder);

  editing = input<Empresa | 'new' | null>(null);
  closed  = output<void>();
  saved   = output<Empresa>();

  readonly visible = computed(() => this.editing() !== null);

  readonly modalTitle = computed(() => {
    const e = this.editing();
    if (!e) return '';
    return e === 'new' ? 'Nueva empresa' : `Editar · ${(e as Empresa).razon_social}`;
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

  readonly form = this.fb.nonNullable.group({
    ruc:               [''],
    razon_social:      [''],
    direccion:         [''],
    ubigeo:            [''],
    usuario_sol:       [''],
    clave_sol:         [''],
    ctedetra:          [''],
    client_id:         [''],
    client_secret:     [''],
    monto700:          [700],
    limite_retencion:  [1400],
    monto_mensual:     [0],
    monto_anual:       [0],
    stdetraccion:      [false],
    stretencion:       [false],
  });

  constructor() {
    effect(() => {
      const e = this.editing();
      if (!e) return;
      if (e === 'new') {
        this.form.reset({
          ruc: '', razon_social: '', direccion: '', ubigeo: '',
          usuario_sol: '', clave_sol: '', ctedetra: '',
          client_id: '', client_secret: '',
          monto700: 700, limite_retencion: 1400,
          monto_mensual: 0, monto_anual: 0,
          stdetraccion: false, stretencion: false,
        });
        this.logoVertical.set(null);
        this.logoHorizontal.set(null);
        this.logoVerticalPreview.set(null);
        this.logoHorizontalPreview.set(null);
        this.form.controls.razon_social.disable();
        this.form.controls.direccion.disable();
        this.form.controls.ubigeo.disable();
      } else {
        const emp = e as Empresa;
        this.form.patchValue({
          ruc: emp.ruc, razon_social: emp.razon_social,
          direccion: emp.direccion, ubigeo: emp.ubigeo,
          usuario_sol: emp.usuario_sol, clave_sol: emp.clave_sol,
          ctedetra: emp.ctedetra, client_id: emp.client_id,
          client_secret: emp.client_secret,
          monto700: emp.monto700, limite_retencion: emp.limite_retencion,
          monto_mensual: emp.monto_mensual, monto_anual: emp.monto_anual,
          stdetraccion: emp.stdetraccion, stretencion: emp.stretencion,
        });
        this.logoVertical.set(null);
        this.logoHorizontal.set(null);
        this.logoVerticalPreview.set(emp.logo_vertical ?? null);
        this.logoHorizontalPreview.set(emp.logo_horizontal ?? null);
        this.form.controls.razon_social.disable();
        this.form.controls.direccion.disable();
        this.form.controls.ubigeo.disable();
      }
    });
  }

  buscarRuc() {
    const ruc = this.form.controls.ruc.value;
    if (ruc.length !== 11) return;
    this.form.controls.razon_social.enable();
    this.form.controls.direccion.enable();
    this.form.controls.ubigeo.enable();
    this.form.patchValue({
      razon_social: 'EMPRESA DEMO S.A.C.',
      direccion: 'Av. Ejemplo 123, Lima',
      ubigeo: '150101',
    });
    this.form.controls.razon_social.disable();
    this.form.controls.direccion.disable();
    this.form.controls.ubigeo.disable();
  }

  save() {
    const v = this.form.getRawValue();
    const existing = this.editing();
    const empresa: Empresa = {
      id: existing && existing !== 'new' ? (existing as Empresa).id : crypto.randomUUID(),
      ruc: v.ruc,
      razon_social: v.razon_social,
      direccion: v.direccion,
      ubigeo: v.ubigeo,
      usuario_sol: v.usuario_sol,
      clave_sol: v.clave_sol,
      ctedetra: v.ctedetra,
      client_id: v.client_id,
      client_secret: v.client_secret,
      monto700: v.monto700,
      limite_retencion: v.limite_retencion,
      monto_mensual: v.monto_mensual,
      monto_anual: v.monto_anual,
      stdetraccion: v.stdetraccion,
      stretencion: v.stretencion,
      logo_vertical:   this.logoVerticalPreview()   ?? undefined,
      logo_horizontal: this.logoHorizontalPreview() ?? undefined,
      estado: existing && existing !== 'new' ? (existing as Empresa).estado : 'ACTIVO',
    };
    this.saved.emit(empresa);
    this.closed.emit();
  }

  close() { this.closed.emit(); }
}
