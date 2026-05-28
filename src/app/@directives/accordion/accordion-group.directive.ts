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
    // Determines if all accordion contents can be collapsed at the same time
    public fullCollapsible = input(true);
    // Determines if more than one accordion content can be expanded at the same time
    public multiExpandable = input(false);

    public headers = contentChildren(AccordionGroupDirective, { descendants: true });
    public contents = contentChildren(AccordionContentDirective, { descendants: true });

    public toggle(contentId: string): void {
        const content = this.contents().find(c => c.contentId() === contentId);

        // Check if this content cannot be collapsed
        if (content.expanded() && !this.fullCollapsible() && (!this.multiExpandable() || this.contents().filter(c => c.expanded()).length === 1)) {
            return;
        }

        // Check if other accordion contents must be collapsed
        if (!content.expanded() && !this.multiExpandable()) {
            this.contents().forEach(c => c.expanded.set(false));
        }

        content.expanded.set(content.expanded() ? false : true);
    }
}
