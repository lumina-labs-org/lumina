import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { Calendar1, LucideAngularModule, MapPinHouse, TicketPlus } from 'lucide-angular';
import { Event } from '../../services/models/events';

@Component({
  imports: [HlmCardImports, LucideAngularModule, RouterLink, HlmButton, CurrencyPipe, DatePipe],
  selector: 'app-event-card',
  styleUrl: './event-card.scss',
  templateUrl: './event-card.html',
})
export class EventCard {
  readonly event = input.required<Event>();

  protected readonly dateFormattedBRL = () =>
    new Date(this.event().date).toLocaleDateString('pt-BR');

  protected readonly coinFormattedBRL = () =>
    this.event().price.toLocaleString('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    });

  protected readonly mapIcon = MapPinHouse;
  protected readonly dateIcon = Calendar1;
  protected readonly plusIcon = TicketPlus;
}
