import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { CalendarIcon, Check, Dot, LucideAngularModule, Map, MapPinned } from 'lucide-angular';
import { MapAddressComponent } from '../../components/map/map';
import { eventsMock } from '../home/home-page';

export interface TicketCategory {
  id: string;
  name: 'Arena' | 'VIP' | 'Camarote';
  price: number;
  availableQuantity: number;
}

const ticketsMock: TicketCategory[] = [
  {
    id: 'ticket-1',
    name: 'Arena',
    price: 80,
    availableQuantity: 250,
  },
  {
    id: 'ticket-2',
    name: 'VIP',
    price: 180,
    availableQuantity: 100,
  },
  {
    id: 'ticket-3',
    name: 'Camarote',
    price: 350,
    availableQuantity: 40,
  },
];

@Component({
  imports: [
    LucideAngularModule,
    DatePipe,
    CurrencyPipe,
    HlmCardImports,
    HlmButton,
    MapAddressComponent,
  ],
  selector: 'app-event-details',
  styleUrl: './event-details.scss',
  templateUrl: './event-details.html',
})
export class EventDetails {
  protected readonly router = inject(ActivatedRoute);
  protected readonly eventId = this.router.snapshot.paramMap.get('id');

  protected readonly event = eventsMock.filter((event) => event.id === this.eventId)[0];

  protected readonly calendarIcon = CalendarIcon;
  protected readonly mapPinned = MapPinned;
  protected readonly map = Map;
  protected readonly check = Check;
  protected readonly dot = Dot;

  protected readonly tickets = signal<TicketCategory[]>(ticketsMock);

  protected readonly selectedTickets = signal<Record<string, number>>({});

  protected readonly MAX_TICKETS_PER_ORDER = 4

  protected selectedTicketsCount = computed(() => {
    return Object.values(this.selectedTickets()).reduce((total, quantity) => total + quantity, 0);
  });

  protected readonly ticketsTotal = computed(() => {
    return this.tickets().reduce((total, ticket) => {
      return total + this.getTicketSubtotal(ticket.id);
    }, 0);
  });

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  getTicketQuantity(ticketId: string): number {
    return this.selectedTickets()[ticketId] ?? 0;
  }

  increaseTicket(ticketId: string) {
    const ticket = this.tickets().find((item) => item.id === ticketId);
    if (!ticket) return;

    const currentQuantity = this.getTicketQuantity(ticketId);

    if (this.selectedTicketsCount() === this.MAX_TICKETS_PER_ORDER) {
      return;
    }

    if (currentQuantity >= ticket.availableQuantity) return;

    this.selectedTickets.update((selected) => ({
      ...selected,
      [ticketId]: currentQuantity + 1,
    }));
  }

  decreaseTicket(ticketId: string) {
    const currentQuantity = this.getTicketQuantity(ticketId);

    if (currentQuantity <= 0) return;

    this.selectedTickets.update((selected) => ({
      ...selected,
      [ticketId]: currentQuantity - 1,
    }));
  }

  getTicketSubtotal(ticketId: string): number {
    const ticket = this.tickets().find((item) => item.id === ticketId);
    if (!ticket) return 0;

    return ticket.price * this.getTicketQuantity(ticketId);
  }

  clearTickets() {
    this.selectedTickets.set({});
  }
}
