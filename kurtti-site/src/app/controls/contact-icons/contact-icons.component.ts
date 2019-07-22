import { Component, Input } from '@angular/core';

@Component({
    selector: 'contact-icons',
    templateUrl: './contact-icons.component.html',
    styleUrls: ['./contact-icons.component.scss']
})
export class ContactIconsComponent {
    @Input() iconClass = '';
}
