import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeferLoadDirectiveModule } from '@directives/defer-load/defer-load.module';
import { LetDirectiveModule } from '@directives/let/let.module';
import { TooltipModule } from '@directives/tooltip/tooltip.module';
import { TimelinePipeModule } from '@pipes/timeline/timeline.module';
import { ContactIconsComponent } from './@controls/contact-icons/contact-icons.component';
import { NavigationComponent } from './@controls/navigation/navigation.component';
import { SectionTitleComponent } from './@controls/section-title/section-title.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home.component';
import { IntroComponent } from './intro/intro.component';
import { SkillComponent } from './skills/skill/skill.component';
import { SkillsComponent } from './skills/skills.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
    declarations: [
        AboutComponent,
        ContactIconsComponent,
        HomeComponent,
        IntroComponent,
        NavigationComponent,
        SectionTitleComponent,
        SkillsComponent,
        SkillComponent,
        TimelineComponent
    ],
    imports: [
        CommonModule,
        DeferLoadDirectiveModule,
        LetDirectiveModule,
        TimelinePipeModule,
        TooltipModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomeComponent
            }
        ])
    ]
})
export class HomeModule {}
