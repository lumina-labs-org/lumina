import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrganizationCard } from '../../components/organization-card/organization-card';
import { Organization } from '../../services/models/organization';
import { OrganizationsService } from '../../services/organizations.service';

@Component({
  selector: 'app-organizations-page',
  templateUrl: './organizations-page.html',
  styleUrl: './organizations-page.scss',
  imports: [OrganizationCard, RouterLink],
})
export class OrganizationsPage implements OnInit {
  private readonly organizationsService = inject(OrganizationsService);

  protected readonly organizations = signal<Organization[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly search = signal<string>('');

  private readonly devUserId = '11111111-1111-4111-8111-111111111111';

  protected readonly filteredOrganizations = computed(() => {
    const search = this.search().trim().toLowerCase();

    if (!search) {
      return this.organizations();
    }

    return this.organizations().filter((org) => org.name.toLowerCase().includes(search));
  });

  onChangeSearch(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.search.set(value);
  }

  protected loadOrganizations(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.organizationsService.getOrganizations(this.devUserId).subscribe({
      next: (organizations) => {
        this.organizations.set(organizations);
        this.isLoading.set(false);
        console.log('next');
      },
      error: () => {
        this.error.set('Não foi possível carregar as organizações.');
        this.isLoading.set(false);
        console.log('error');
      },
    });
  }

  ngOnInit(): void {
    this.loadOrganizations();
  }

  protected removeOrganization(id: string): void {
    this.organizations.update((organizations) =>
      organizations.filter((organization) => organization.id !== id),
    );
  }
}
