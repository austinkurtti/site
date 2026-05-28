import { Component, HostBinding, Input } from '@angular/core';
import { NewsflashDirective } from '@directives/newsflash/newsflash.directive';

export enum WarshipsNewsflashType {
    core = 1,
    shipSank = 2
}

@Component({
    selector: 'ak-warships-newsflash',
    styleUrl: './warships-newsflash.component.scss',
    templateUrl: './warships-newsflash.component.html'
})
export class WarshipsNewsflashComponent extends NewsflashDirective {
    @Input() @HostBinding('attr.data-type') type: WarshipsNewsflashType;
    @Input() message = '';
}
