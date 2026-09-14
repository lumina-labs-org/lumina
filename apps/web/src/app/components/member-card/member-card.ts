import { Component, input, output } from '@angular/core';
import { MembershipRolePipe } from '../../pipes/membership-role-pipe';
import { MembershipStatus, MembershipStatusPipe } from '../../pipes/membership-status-pipe';
import { Membership } from '../../services/models/membership';
import { BadgeVariant, Badge } from '../ui/badge/badge';

@Component({
  imports: [MembershipRolePipe, MembershipStatusPipe, Badge],
  selector: 'app-membercard',
  templateUrl: './member-card.html',
  styleUrl: './member-card.scss',
})
export class MemberCard {
  readonly membership = input.required<Membership>();

   protected get statusVariant(): BadgeVariant {
    const variants: Record<MembershipStatus, BadgeVariant> = {
      ACTIVE: 'success',
      PENDING: 'warning',
      DECLINED: 'danger',
      REVOKED: 'neutral',
    };

    return variants[this.membership().status];
  }
}
