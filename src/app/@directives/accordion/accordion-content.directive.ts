import { Directive, input, model } from "@angular/core";

@Directive({
    selector: '[akAccordionContent]',
    exportAs: 'akAccordionContent',
    host: {
        'class': 'ak-accordion-content',
        '[class.d-none]': '!expanded()'
    }
})
export class AccordionContentDirective {
    public contentId = input.required<string>();
    public expanded = model(false);
}
