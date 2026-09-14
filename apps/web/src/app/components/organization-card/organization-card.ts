
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Organization } from '../../services/models/organization';

@Component({
  imports: [RouterLink],
  selector: 'app-organization-card',
  templateUrl: './organization-card.html',
  styleUrl: "./organization-card.scss"
})
export class OrganizationCard {
  readonly organization = input.required<Organization>();

  readonly remove = output<string>()

  protected requestRemove() {
    this.remove.emit(this.organization().id)
  }

}
