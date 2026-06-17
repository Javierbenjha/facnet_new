import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputText, Checkbox],
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router); 
  private readonly route = inject(ActivatedRoute);


  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if(this.form.invalid) return;

    this.auth.login(this.form.getRawValue()).subscribe({
      //next: () => this.router.navigate(['./sales']),
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/sales';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => console.error('Login failed', err),
    })

  }
}
