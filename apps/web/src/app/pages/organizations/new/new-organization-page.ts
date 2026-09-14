import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationsService } from '../../../services/organizations.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-organization-page',
  imports: [ReactiveFormsModule],
  templateUrl: './new-organization-page.html',
  styleUrl: './new-organization-page.scss',
})
export class NewOrganizationPage {
  private readonly organizationsService = inject(OrganizationsService);
  private readonly router = inject(Router);

  private readonly devUserId = '11111111-1111-4111-8111-111111111111';

  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const name = this.form.controls.name.value.trim();

    if (!name) {
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    this.organizationsService.createOrganization(name, this.devUserId).subscribe({
      next: (response) => {
        console.log('Organização criada:', response.organization);

        this.isSubmitting.set(false);

        this.router.navigate([`/organizations`, response.organization.id])
      },

      error: () => {
        this.submitError.set('Não foi possível criar a organização.');

        this.isSubmitting.set(false);
      },
    });
  }
}
