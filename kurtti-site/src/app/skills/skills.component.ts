import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@base/base.component';

@Component({
    selector: 'skills',
    styleUrls: ['./skills.component.scss'],
    templateUrl: './skills.component.html'
})
export class SkillsComponent extends BaseComponent implements OnInit {
    public ngOnInit() {
        super.ngOnInit();
        this.title = 'Skill set.';
    }

    protected secretActivated = (): void => {
        this.title = '"I have a particular set of skills." - Liam Neeson';
    }
}
