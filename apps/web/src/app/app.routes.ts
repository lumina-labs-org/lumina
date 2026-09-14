import { Routes } from '@angular/router';
import { OrganizationDetailsPage } from './pages/organizations/details/organization-details-page';
import { NewOrganizationPage } from './pages/organizations/new/new-organization-page';
import { OrganizationsPage } from './pages/organizations/organizations-page';

export const routes: Routes = [
  {
    path: 'organizations',
    component: OrganizationsPage,
  },
  {
    path: 'organizations/new',
    component: NewOrganizationPage,
  },
  {
    path: 'organizations/:id',
    component: OrganizationDetailsPage,
  },
];
