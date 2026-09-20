import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'fl-site-nav',
  imports: [RouterLink],
  templateUrl: './site-nav.html',
  styleUrl: './site-nav.scss',
  host: {
    '[class.bar]': 'variant() === "bar"',
    '[class.mark]': 'variant() === "mark"',
  },
})
export class FlSiteNav {
  /** `bar` is the compact landing chrome. `mark` is the brand cluster for the morph. */
  readonly variant = input<'bar' | 'mark'>('bar');
  /** Hash or URL for the brand. Empty uses the landing home route. */
  readonly href = input<string | undefined>(undefined);
}
