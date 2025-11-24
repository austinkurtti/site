import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WarshipsManager } from '../warships-manager';
import { WarshipsDifficulty, WarshipsScreenState } from '../warships.models';

@Component({
    selector: 'ak-warships-new-game-screen',
    styleUrl: './new-game-screen.component.scss',
    templateUrl: './new-game-screen.component.html',
    imports: [
        CommonModule,
        FormsModule
    ]
})
export class WarshipsNewGameScreen {
    public gameManager = inject(WarshipsManager);

    public difficulty = signal(WarshipsDifficulty.easy);

    public Difficulty = WarshipsDifficulty;
    public ScreenState = WarshipsScreenState;
}
