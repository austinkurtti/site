import { Component, HostBinding, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@services/theme.service';
import { ThemeCardComponent } from "./theme-card/theme-card.component";

@Component({
    selector: 'ak-theme',
    styleUrls: ['./theme.component.scss'],
    templateUrl: './theme.component.html',
    imports: [
        FormsModule,
        ThemeCardComponent
    ]
})
export class ThemeComponent {
    @HostBinding('class') classes = 'd-block p-3';

    public themeService = inject(ThemeService);
}
