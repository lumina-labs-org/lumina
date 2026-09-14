import { Pipe, PipeTransform } from '@angular/core';

export type MembershipStatus = 'PENDING' | 'ACTIVE' | 'DECLINED' | 'REVOKED';

@Pipe({
  name: 'membershipStatus',
  standalone: true,
})
export class MembershipStatusPipe implements PipeTransform {
  transform(status: MembershipStatus): string {
    const statusMap: Record<MembershipStatus, string> = {
      ACTIVE: 'Ativo',
      PENDING: 'Pendente',
      DECLINED: 'Recusado',
      REVOKED: 'Revogado',
    };

    return statusMap[status] ?? status;
  }
}
