import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { MembershipRolePipe } from '../../pipes/membership-role-pipe';
import { User } from '../../services/models/user';
import { OrganizationsService } from '../../services/organizations.service';
import { UsersService } from '../../services/users.service';

export interface InviteFormProps {
  inviterId: string;
  invitedUserId: string;
  role: string;
}

@Component({
  selector: 'app-invite-form',
  templateUrl: './invite-form.html',
  imports: [ReactiveFormsModule, MembershipRolePipe],
})
export class InviteFormComponent implements OnInit {
  readonly error = input<string | null>(null);
  readonly submitting = input(false);

  readonly cancel = output<void>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly usersService = inject(UsersService);

  protected readonly users = signal<User[]>([]);
  protected readonly usersLoading = signal(false);
  protected readonly usersError = signal<string | null>(null);

  protected readonly selectedUser = signal<User | null>(null);
  protected readonly hasSearch = signal(false);
  protected readonly submit = output<InviteFormProps>();

  protected readonly form = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    role: new FormControl<'MANAGER' | 'MEMBER'>('MANAGER', {
      nonNullable: true,
    }),
  });

  constructor() {
    this.form.controls.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),

        tap(() => {
          this.selectedUser.set(null);
          this.usersError.set(null);
        }),

        switchMap((value) => {
          const query = value.trim();

          if (query.length < 2) {
            this.users.set([]);
            this.usersLoading.set(false);
            return of([]);
          }

          this.usersLoading.set(true);

          return this.usersService.getUsers(query).pipe(
            catchError(() => {
              this.usersError.set('Não foi possível buscar usuários.');
              return of([]);
            }),
          );
        }),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((users) => {
        this.users.set(users);
        this.usersLoading.set(false);
      });
  }

  protected requestSubmit(): void {
    const user = this.selectedUser();

    if (!user || this.form.invalid) {
      return;
    }

    this.submit.emit({
      inviterId: '11111111-1111-4111-8111-111111111111',
      invitedUserId: user.id,
      role: this.form.controls.role.value,
    });
  }

  protected readonly organizationsService = inject(OrganizationsService);

  protected readonly roles = [
    { id: 1, name: 'MANAGER' },
    { id: 2, name: 'MEMBER' },
  ];

  protected role = signal('MANAGER');

  protected getInitials(name: string): string {
    const nameArray: string[] = name.split(` `);
    const initials = nameArray[0].at(0) + nameArray[1].at(0)!;
    return initials;
  }

  loadUsers(): void {
    this.usersLoading.set(true);

    this.usersService.getUsers(this.form.controls.search.value!).subscribe({
      next: (users) => {
        console.log(users);
        this.users.set(users);
        this.usersLoading.set(false);
      },
      error: (error) => {
        console.error('error', JSON.stringify(error, null, 2));

        this.usersError.set(error.error.message);
        this.usersLoading.set(false);
      },
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  protected onChangeSearch(event: Event): void {
    const { value } = event.target as HTMLInputElement;

    if (value !== '') {
      this.users.update((users) =>
        users!.filter((user) => user.name.toLowerCase().includes(value.toLowerCase())),
      );

      this.hasSearch.set(true);
      return;
    } else {
      this.loadUsers();
    }

    this.hasSearch.set(false);
  }

  protected onSelectUser(user: User): void {
    this.selectedUser.set(user);

    this.form.controls.search.setValue(user.name, {
      emitEvent: false,
    });

    this.users.set([]);
    this.hasSearch.set(false);
  }
}
