import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
    standalone: true,
    imports: [
        CommonModule
    ],
    selector: 'ak-toggle',
    styleUrls: ['./toggle.component.scss'],
    templateUrl: './toggle.component.html'
})
export class ToggleComponent {
    @Input() value: boolean;
    @Input() @HostBinding('class.disabled') disabled: boolean;

    @Output() valueChange = new EventEmitter<boolean>();

    public toggle(): void {
        if (!this.disabled) {
            this.value = !this.value;
            this.valueChange.emit(this.value);
        }
    }
}
