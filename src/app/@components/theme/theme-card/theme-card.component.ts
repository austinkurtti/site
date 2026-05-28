import { Component, input } from '@angular/core';

@Component({
    selector: 'ak-theme-card',
    styleUrls: ['./theme-card.component.scss'],
    templateUrl: './theme-card.component.html',
    host: {
        '[attr.card-theme]': 'theme()',
        '[attr.disabled]': 'disabled()'
    }
})
export class ThemeCardComponent {
    public theme = input('');
    public disabled = input(false);
}
