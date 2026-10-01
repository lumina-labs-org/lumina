import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);

  getUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3333/api/users', { params: { query } });
  }
}
