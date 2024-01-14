import { Directive, Renderer2, ViewChild, inject } from '@angular/core';
import { DeferLoadDirective } from '@directives/defer-load/defer-load.directive';

@Directive()
export abstract class SectionDirective {
    @ViewChild(DeferLoadDirective) deferredContent: DeferLoadDirective;

    public deferThreshold = .25;

    private _renderer = inject(Renderer2);

    public abstract navigationId: string;

    public deferLoad(): void {
        this._renderer.addClass(this.deferredContent.elementRef.nativeElement, 'loaded');
    }
}
