import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'ak-project',
    styleUrls: ['./project.component.scss'],
    templateUrl: './project.component.html',
    imports: [
        CommonModule,
        RouterLink
    ]
})
export class ProjectComponent {
    public name = input.required<string>();
    public icon = input.required<string>();
    public gitHubLink = input<string>();
    public externalLink = input<string>();

    public hasLinks = computed(() => this.gitHubLink() || this.externalLink());
}
