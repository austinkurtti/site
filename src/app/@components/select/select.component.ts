import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, inject, Input, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export class SelectOption<T> {
    label: string;
    value: T;

    constructor(label: string, value: T) {
        this.label = label;
        this.value = value;
    }
}

@Component({
    imports: [
        CommonModule,
        FormsModule
    ],
    selector: 'ak-select',
    styleUrls: ['./select.component.scss'],
    templateUrl: './select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true
        }
    ]
})
export class SelectComponent implements ControlValueAccessor {
    @Input() id: string;
    @Input() label: string;
    @Input() options: SelectOption<any>[] = [];

    @ViewChild('selectEl', { static: true }) select: ElementRef;

    public focusing = false;
    public value: any;

    public onChange: any = (_: any) => {};
    public onTouched: any = () => {};

    private _renderer = inject(Renderer2);

    private _unlisteners = new Array<() => void>();

    public ngAfterViewInit(): void {
        this._unlisteners.push(this._renderer.listen(this.select.nativeElement, 'blur', () => this.focusing = false));
        this._unlisteners.push(this._renderer.listen(this.select.nativeElement, 'focus', () => this.focusing = true));
    }

    public ngOnDestroy(): void {
        this._unlisteners.forEach(unlisten => unlisten());
        this._unlisteners = [];
    }

    public writeValue(obj: any): void {
        this.value = obj;
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public onValueChange(val: any) {
        this.value = val;
        this.onChange(val);
        this.onTouched();
    }
}
