import { Component, Input } from '@angular/core';
import { ContactIcon } from './contact-icon.model';

@Component({
    selector: 'ak-contact-icons',
    templateUrl: './contact-icons.component.html',
    styleUrls: ['./contact-icons.component.scss']
})
export class ContactIconsComponent {
    @Input() iconClass = '';

    public icons = [
        new ContactIcon({
            href: 'https://www.linkedin.com/in/austinkurtti',
            class: 'fab fa-linkedin'
        }),
        new ContactIcon({
            href: 'mailto:austin.kurtti@gmail.com',
            class: 'fas fa-envelope-square'
        }),
        new ContactIcon({
            href: 'https://github.com/austinkurtti',
            class: 'fab fa-github-square'
        }),
    ];
}
