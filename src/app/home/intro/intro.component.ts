import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { introId } from '@constants/strings';
import { TooltipDirective } from '../../@directives/tooltip/tooltip.directive';
import { SectionDirective } from '../@controls/section/section.directive';

@Component({
    selector: 'ak-intro',
    styleUrls: ['./intro.component.scss'],
    templateUrl: './intro.component.html',
    imports: [
        NgOptimizedImage,
        TooltipDirective
    ]
})
export class IntroComponent extends SectionDirective {
    public navigationId = introId;
}
