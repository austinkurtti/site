import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactIconModel } from './contact-icon.model';

@Component({
    selector: 'ak-contact-icons',
    templateUrl: './contact-icons.component.html',
    styleUrls: ['./contact-icons.component.scss'],
    imports: [
        CommonModule
    ]
})
export class ContactIconsComponent {
    public icons = [
        new ContactIconModel({
            href: 'https://www.linkedin.com/in/austinkurtti',
            class: 'fab fa-linkedin-in'
        }),
        new ContactIconModel({
            href: 'https://www.instagram.com/austin.kurtti/',
            class: 'fab fa-instagram'
        }),
        new ContactIconModel({
            href: 'mailto:austin.kurtti@gmail.com',
            class: 'fas fa-at'
        }),
        new ContactIconModel({
            href: 'https://github.com/austinkurtti',
            class: 'fab fa-github'
        }),
    ];
}
