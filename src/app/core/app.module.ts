import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { DeferLoadDirective } from '@directives/defer-load.directive';
import { AboutComponent } from '../about/about.component';
import { EducationComponent } from '../education/education.component';
import { ExperienceComponent } from '../experience/experience.component';
import { SkillsComponent } from '../skills/skills.component';
import { SectionTitleComponent } from '../controls/section-title/section-title.component';
import { ContactIconsComponent } from '../controls/contact-icons/contact-icons.component';
import { TooltipDirective } from '@directives/tooltip.directive';
import { TimelinePipe } from '../@pipes/timeline.pipe';

@NgModule({
    declarations: [
        AppComponent,
        TimelinePipe,
        DeferLoadDirective,
        TooltipDirective,
        ContactIconsComponent,
        SectionTitleComponent,
        AboutComponent,
        EducationComponent,
        ExperienceComponent,
        SkillsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
