import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Lumina');
  protected readonly canCreateOrganization = signal(false);

  protected readonly organizationName = signal('Lumina');
  protected readonly role = signal('MANAGER');
}
