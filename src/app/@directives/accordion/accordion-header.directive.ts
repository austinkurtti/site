import { computed, Directive, inject, input } from "@angular/core";
import { AccordionGroupDirective } from "./accordion-group.directive";

@Directive({
    selector: '[akAccordionHeader]',
    exportAs: 'akAccordionHeader',
    host: {
        'role': 'button',
        'class': 'ak-accordion-header',
        '(click)': 'toggle()'
    }
})
export class AccordionHeaderDirective {
    public contentId = input.required<string>();
    public contentExpanded = computed(() => {
        const content = this._group.contents().find(c => c.contentId() === this.contentId());
        return content ? content.expanded() : false;
    });

    private _group = inject(AccordionGroupDirective);

    public toggle(): void {
        this._group.toggle(this.contentId());
    }
}
