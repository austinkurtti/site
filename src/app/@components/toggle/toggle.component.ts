import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { TooltipDirective } from '@directives/tooltip/tooltip.directive';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        TooltipDirective
    ],
    selector: 'ak-toggle',
    styleUrls: ['./toggle.component.scss'],
    templateUrl: './toggle.component.html'
})
export class ToggleComponent implements OnInit {
    @Input() label: string;
    @Input() labelCols: string;
    @Input() labelDescription: string;
    @Input() expandLabelDescription: boolean;
    @Input() value: boolean;
    @Input() wrap: boolean;
    @Input() @HostBinding('class.disabled') disabled: boolean;

    @Output() valueChange = new EventEmitter<boolean>();

    private _id: string;

    public get id(): string {
        return this._id;
    }

    public ngOnInit(): void {
        this._id = crypto.randomUUID().toString();
    }

    public toggle(): void {
        if (!this.disabled) {
            this.value = !this.value;
            this.valueChange.emit(this.value);
        }
    }
}
