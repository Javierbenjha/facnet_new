import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Toaster } from '../../../core/services/toast';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly loading = signal(false);
  private readonly toast = inject(Toaster);

  readonly form = this.fb.nonNullable.group({
    nombre: ['',[Validators.required]],
    apellido_paterno: ['',[Validators.required]],
    apellido_materno: ['',[Validators.required]],
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(8)]],
    telefono: ['',[Validators.required]]
  })

  onSubmit(){
    if(this.form.invalid) return;

    this.loading.set
  }



}
