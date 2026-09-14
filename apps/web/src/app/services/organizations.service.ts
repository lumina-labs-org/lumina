import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization, OrganizationResponse } from './models/organization';
import { OrganizationMembersResponse } from './models/membership';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  private readonly http = inject(HttpClient);

  getOrganizations(userId: string): Observable<Organization[]> {
    return this.http.get<Organization[]>(
      `http://localhost:3333/api/organizations?userId=${userId}`,
    );
  }

  createOrganization(name: string, userId: string): Observable<OrganizationResponse> {
    return this.http.post<OrganizationResponse>('http://localhost:3333/api/organizations', {
      name,
      userId,
    });
  }

  getOrganizationById(id: string): Observable<OrganizationResponse> {
    return this.http.get<OrganizationResponse>(`http://localhost:3333/api/organizations/${id}`);
  }

  getOrganizationMembers(id: string): Observable<OrganizationMembersResponse> {
    return this.http.get<OrganizationMembersResponse>(
      `http://localhost:3333/api/organizations/${id}/members`,
    );
  }
}
