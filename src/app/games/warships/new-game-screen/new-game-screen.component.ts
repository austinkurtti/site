import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionContentDirective } from "@directives/accordion/accordion-content.directive";
import { AccordionGroupDirective } from "@directives/accordion/accordion-group.directive";
import { AccordionHeaderDirective } from "@directives/accordion/accordion-header.directive";
import { WarshipsManager } from '../warships-manager';
import { WarshipsDifficulty, WarshipsScreenState } from '../warships.models';

@Component({
    selector: 'ak-warships-new-game-screen',
    styleUrl: './new-game-screen.component.scss',
    templateUrl: './new-game-screen.component.html',
    imports: [
        AccordionContentDirective,
        AccordionGroupDirective,
        AccordionHeaderDirective,
        CommonModule,
        FormsModule
    ]
})
export class WarshipsNewGameScreen {
    public gameManager = inject(WarshipsManager);

    public difficulty = signal(WarshipsDifficulty.recruit);

    public Difficulty = WarshipsDifficulty;
    public ScreenState = WarshipsScreenState;
}
