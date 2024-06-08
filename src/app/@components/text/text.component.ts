import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    selector: 'ak-text',
    styleUrls: ['./text.component.scss'],
    templateUrl: './text.component.html'
})
export class TextComponent {
    @Input() minLength = 0;
    @Input() maxLength = 100;
    @Input() placeholder = '';
    @Input() value: string;

    @Output() valueChange = new EventEmitter<string>();
}
