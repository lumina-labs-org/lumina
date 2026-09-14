import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Membership } from '../../../services/models/membership';
import { Organization } from '../../../services/models/organization';
import { OrganizationsService } from '../../../services/organizations.service';
import { MemberCard } from '../../../components/member-card/member-card';

@Component({
  selector: 'app-organization-details-page',
  templateUrl: './organization-details-page.html',
  styleUrl: './organization-details-page.scss',
  imports: [RouterLink, MemberCard],
})
export class OrganizationDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  protected readonly orgId = this.route.snapshot.paramMap.get('id');

  protected readonly organizationsService = inject(OrganizationsService);

  protected readonly organization = signal<Organization | null>(null);
  protected readonly organizationLoading = signal(false);
  protected readonly organizationError = signal<string | null>(null);

  protected readonly members = signal<Membership[]>([]);
  protected readonly memberLoading = signal(false);
  protected readonly memberError = signal<string | null>(null);

  loadOrganizationDetails(): void {
    this.organizationLoading.set(true);
    if (!this.orgId) return;

    this.organizationsService.getOrganizationById(this.orgId).subscribe({
      next: ({ organization }) => {
        this.organization.set(organization);
        this.organizationLoading.set(false);
      },
      error: (error) => {
        console.error('error', JSON.stringify(error, null, 2));

        this.organizationError.set(error.error.message);
        this.organizationLoading.set(false);
      },
    });
  }

  loadOrganizationMembers(): void {
    this.memberLoading.set(true);
    if (!this.orgId) return;

    this.organizationsService.getOrganizationMembers(this.orgId).subscribe({
      next: ({ memberships }) => {
        this.members.set(memberships);
        this.memberLoading.set(false);
      },
      error: (error) => {
        console.error('error', JSON.stringify(error, null, 2));

        this.memberError.set(error.error.message);
        this.memberLoading.set(false);
      },
    });
  }

  ngOnInit(): void {
    this.loadOrganizationDetails();
    this.loadOrganizationMembers();
  }
}
