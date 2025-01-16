import { Component } from '@angular/core';
import { ContactIconModel } from './contact-icon.model';

@Component({
    selector: 'ak-contact-icons',
    templateUrl: './contact-icons.component.html',
    styleUrls: ['./contact-icons.component.scss'],
    standalone: false
})
export class ContactIconsComponent {
    public icons = [
        new ContactIconModel({
            href: 'https://www.linkedin.com/in/austinkurtti',
            class: 'fab fa-linkedin'
        }),
        new ContactIconModel({
            href: 'mailto:austin.kurtti@gmail.com',
            class: 'fas fa-envelope-square'
        }),
        new ContactIconModel({
            href: 'https://github.com/austinkurtti',
            class: 'fab fa-github-square'
        }),
    ];
}
