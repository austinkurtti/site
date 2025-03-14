import { Component } from '@angular/core';
import { projectsId, projectsText } from '@constants/strings';
import { DeferLoadDirective } from '@directives/defer-load/defer-load.directive';
import { SectionTitleComponent } from '../@controls/section-title/section-title.component';
import { SectionDirective } from '../@controls/section/section.directive';
import { ProjectComponent } from './project/project.component';

@Component({
    selector: 'ak-projects',
    styleUrls: ['./projects.component.scss'],
    templateUrl: './projects.component.html',
    imports: [
        DeferLoadDirective,
        ProjectComponent,
        SectionTitleComponent
    ]
})
export class ProjectsComponent extends SectionDirective {
    public navigationId = projectsId;
    public title = projectsText;
}
