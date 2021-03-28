import { Component, Input } from '@angular/core';

@Component({
    selector: 'ak-contact-icons',
    templateUrl: './contact-icons.component.html',
    styleUrls: ['./contact-icons.component.scss']
})
export class ContactIconsComponent {
    @Input() iconClass = '';
}
