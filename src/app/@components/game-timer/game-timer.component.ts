import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'ak-game-timer',
    styleUrls: ['./game-timer.component.scss'],
    templateUrl: './game-timer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule
    ]
})
export class GameTimerComponent {
    public state = false;

    public click() {
        // asdf
    }
}
