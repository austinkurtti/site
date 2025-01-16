import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface ILetContext<T> {
    akLet: T;
}

@Directive({
    selector: '[akLet]',
    standalone: false
})
export class LetDirective<T> {
    @Input()
    private set akLet(value: T) {
        this._context.akLet = value;
    }

    private _context: ILetContext<T> = { akLet: undefined };

    constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef<ILetContext<T>>) {
        viewContainer.createEmbeddedView(templateRef, this._context);
    }
}
