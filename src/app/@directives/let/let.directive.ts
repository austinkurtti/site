import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface ILetContext<T> {
    akLet: T;
}

@Directive({ selector: '[akLet]' })
export class LetDirective<T> {
    private _context: ILetContext<T> = { akLet: undefined };

    constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef<ILetContext<T>>) {
        viewContainer.createEmbeddedView(templateRef, this._context);
    }

    @Input()
    private set akLet(value: T) {
        this._context.akLet = value;
    }
}
