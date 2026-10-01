import { Component, input, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-map-address',
  standalone: true,
  template: `
    <section class="w-full px-8 py-12">
      <h2 class="mb-10 text-[22px] font-bold uppercase tracking-wide text-zinc-800">
        Como chegar
      </h2>

      <div class="h-87.5 w-full overflow-hidden">
        <iframe
          class="h-full w-full border-0"
          [src]="mapUrl()"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  `,
})
export class MapAddressComponent {
  private sanitizer = inject(DomSanitizer);

  address = input.required<string>();

  mapUrl = computed(() => {
    const encodedAddress = encodeURIComponent(this.address());

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${encodedAddress}&output=embed`
    );
  });
}
