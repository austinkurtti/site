import { contentChildren, Directive, input } from '@angular/core';
import { AccordionContentDirective } from './accordion-content.directive';

@Directive({
    selector: '[akAccordionGroup]',
    exportAs: 'akAccordionGroup',
    host: {
        'class': 'ak-accordion-group'
    }
})
export class AccordionGroupDirective {
    public multiExpandable = input(false);
    public headers = contentChildren(AccordionGroupDirective, { descendants: true });
    public contents = contentChildren(AccordionContentDirective, { descendants: true });

    public toggle(contentId: string): void {
        const content = this.contents().find(c => c.contentId() === contentId);

        if (!content.expanded() && !this.multiExpandable()) {
            this.contents().forEach(c => c.expanded.set(false));
        }

        content.expanded.set(content.expanded() ? false : true);
    }
}
