import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { OrganizationDetailsPage } from './pages/organizations/details/organization-details-page';
import { NewOrganizationPage } from './pages/organizations/new/new-organization-page';
import { OrganizationsPage } from './pages/organizations/organizations-page';
import { HomePage } from './pages/home/home-page';
import { EventDetails } from './pages/event-details/event-details';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: 'events/:id',
        component: EventDetails,
      }
    ],
  },
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
