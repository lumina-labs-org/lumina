import { Component } from '@angular/core';
import { LucideAngularModule, Search, User } from 'lucide-angular';

@Component({
  imports: [LucideAngularModule],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly searchIcon = Search;
  protected readonly userIcon = User;
}
