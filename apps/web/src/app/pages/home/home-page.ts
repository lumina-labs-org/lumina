import { Component, computed, signal } from '@angular/core';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { CalendarClock, LucideAngularModule, MapPin, SearchIcon } from 'lucide-angular';
import { EventCard } from '../../components/event-card/event-card';
import { Event as EventModel } from '../../services/models/events';

type EventCategory =
  'all'
  | 'música'
  | 'tecnologia'
  | 'workshop'
  | 'gastronomia';

export const eventsMock = [
    {
      id: '1',
      title: 'Festival de Verão Salvador',
      category: 'Música',
      date: '2026-10-12',
      location: 'Arena Fonte Nova - Salvador, BA',
      price: 80,
      imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    },
    {
      id: '2',
      title: 'Tech Conference Bahia',
      category: 'Tecnologia',
      date: '2026-10-24',
      location: 'Salvador, BA',
      price: 120,
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    },
    {
      id: '3',
      title: 'Workshop de Fotografia Urbana',
      category: 'Workshop',
      date: '2026-11-08',
      location: 'Salvador, BA',
      price: 45,
      imageUrl: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848',
    },
    {
      id: '4',
      title: 'Festival Gastronômico da Bahia',
      category: 'Gastronomia',
      date: '2026-11-21',
      location: 'Rua Silveira Martins - Salvador, BA',
      price: 35,
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    },
  ]

@Component({
  imports: [
    HlmInputGroupImports,
    HlmButtonImports,
    EventCard,
    LucideAngularModule,
    HlmTabsImports,
    ɵInternalFormsSharedModule,
  ],
  selector: 'app-home',
  styleUrl: './home-page.scss',
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly searchIcon = SearchIcon;
  protected readonly mapIcon = MapPin;
  protected readonly calendarIcon = CalendarClock;

  protected readonly featuredEvents = signal<EventModel[]>(eventsMock);

  protected readonly selectedCategory = signal<EventCategory>('all');

  protected readonly filteredEvents = computed<EventModel[]>(() => {
    if (this.selectedCategory() === 'all') {
      return this.featuredEvents();
    }

    return this.featuredEvents().filter(
      (event) => event.category.toLowerCase() === this.selectedCategory(),
    );
  });

  onSelectCategory(category: string) {
    this.selectedCategory.set(category as EventCategory);
  }
}
