import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipDirective } from '@directives/tooltip/tooltip.directive';

@Component({
    imports: [
        CommonModule,
        FormsModule,
        TooltipDirective
    ],
    selector: 'ak-text',
    styleUrls: ['./text.component.scss'],
    templateUrl: './text.component.html'
})
export class TextComponent implements AfterViewInit, OnDestroy {
    @Input() buttonClass = '';
    @Input() buttonTooltip = '';
    @Input() label: string;
    @Input() minLength = 0;
    @Input() maxLength = 100;
    @Input() value: string;

    @Output() buttonClick = new EventEmitter<void>();
    @Output() valueChange = new EventEmitter<string>();

    @ViewChild('textInput', { static: true }) input: ElementRef;

    public focusing = false;

    private _renderer = inject(Renderer2);

    private _unlisteners = new Array<() => void>();

    public ngAfterViewInit(): void {
        this._unlisteners.push(this._renderer.listen(this.input.nativeElement, 'blur', () => this.focusing = false));
        this._unlisteners.push(this._renderer.listen(this.input.nativeElement, 'focus', () => this.focusing = true));
    }

    public ngOnDestroy(): void {
        this._unlisteners.forEach(unlisten => unlisten());
        this._unlisteners = [];
    }
}
