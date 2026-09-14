  import { Component, input } from '@angular/core';

  export type BadgeVariant =
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral';

  @Component({
    selector: 'app-badge',
    templateUrl: './badge.html',
  })
  export class Badge {
    readonly label = input.required<string>();

    readonly variant = input<BadgeVariant>('neutral');

    protected readonly variantClasses: Record<BadgeVariant, string> = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: "bg-orange-600 text-zinc-100",
      danger: 'bg-red-100 text-red-800',
      neutral: 'bg-zinc-100 text-zinc-700',
    };

    protected get classes(): string {
      return [
        'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium',
        this.variantClasses[this.variant()],
      ].join(' ');
    }
  }
