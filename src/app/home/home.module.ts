import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeferLoadDirectiveModule } from '@directives/defer-load/defer-load.module';
import { LetDirectiveModule } from '@directives/let/let.module';
import { MenuDirectiveModule } from '@directives/menu/menu.module';
import { TooltipModule } from '@directives/tooltip/tooltip.module';
import { ContactIconsComponent } from './@controls/contact-icons/contact-icons.component';
import { SectionTitleComponent } from './@controls/section-title/section-title.component';
import { AboutComponent } from './about/about.component';
import { CareerItemComponent } from './career/career-item/career-item.component';
import { CareerComponent } from './career/career.component';
import { HomeComponent } from './home.component';
import { IntroComponent } from './intro/intro.component';
import { SkillComponent } from './skills/skill/skill.component';
import { SkillsComponent } from './skills/skills.component';

@NgModule({
    declarations: [
        AboutComponent,
        ContactIconsComponent,
        HomeComponent,
        IntroComponent,
        SectionTitleComponent,
        SkillsComponent,
        SkillComponent,
        CareerComponent,
        CareerItemComponent
    ],
    imports: [
        CommonModule,
        DeferLoadDirectiveModule,
        LetDirectiveModule,
        MenuDirectiveModule,
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
