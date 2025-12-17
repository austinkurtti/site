import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AccordionContentDirective } from '@directives/accordion/accordion-content.directive';
import { AccordionGroupDirective } from '@directives/accordion/accordion-group.directive';
import { AccordionHeaderDirective } from '@directives/accordion/accordion-header.directive';
import { DialogDirective } from '@directives/dialog/dialog.directive';

@Component({
    selector: 'ak-warships-help-dialog',
    styleUrl: './help-dialog.component.scss',
    templateUrl: './help-dialog.component.html',
    imports: [
        AccordionContentDirective,
        AccordionGroupDirective,
        AccordionHeaderDirective,
        CommonModule
    ]
})
export class WarshipsHelpDialogComponent extends DialogDirective {}
