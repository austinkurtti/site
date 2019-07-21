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
import { SkillCarouselComponent } from '../controls/skill-slider/skill-carousel.component';

@NgModule({
    declarations: [
        AppComponent,
        DeferLoadDirective,
        SectionTitleComponent,
        SkillCarouselComponent,
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
    bootstrap: [AppComponent]
})
export class AppModule { }
