import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeferLoadDirectiveModule } from '@directives/defer-load/defer-load.module';
import { TooltipModule } from '@directives/tooltip/tooltip.module';
import { TimelinePipe } from './@pipes/timeline.pipe';
import { AboutComponent } from './about/about.component';
import { CareerComponent } from './career/career.component';
import { ContactIconsComponent } from './@controls/contact-icons/contact-icons.component';
import { NavigationComponent } from './@controls/navigation/navigation.component';
import { SectionTitleComponent } from './@controls/section-title/section-title.component';
import { IntroComponent } from './intro/intro.component';
import { SkillsComponent } from './skills/skills.component';
import { HomeComponent } from './home.component';

@NgModule({
    declarations: [
        HomeComponent,
        TimelinePipe,
        ContactIconsComponent,
        SectionTitleComponent,
        NavigationComponent,
        IntroComponent,
        AboutComponent,
        CareerComponent,
        SkillsComponent
    ],
    imports: [
        CommonModule,
        DeferLoadDirectiveModule,
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
