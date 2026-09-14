import { Pipe, PipeTransform } from '@angular/core';

export type MembershipRole = 'OWNER' | 'MANAGER' | 'MEMBER';

@Pipe({
  name: 'membershipRole',
  standalone: true,
})
export class MembershipRolePipe implements PipeTransform {
  transform(role: MembershipRole): string {
    const roleMap: Record<MembershipRole, string> = {
      OWNER: 'Dono',
      MANAGER: 'Gerente',
      MEMBER: 'Membro',
    };

    return roleMap[role] ?? role;
  }
}
