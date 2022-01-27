import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { DeferLoadDirective } from '@directives/defer-load.directive';
import { AboutComponent } from '../about/about.component';
import { CareerComponent } from '../career/career.component';
import { SkillsComponent } from '../skills/skills.component';
import { SectionTitleComponent } from '../controls/section-title/section-title.component';
import { ContactIconsComponent } from '../controls/contact-icons/contact-icons.component';
import { TooltipDirective } from '@directives/tooltip.directive';
import { TimelinePipe } from '../@pipes/timeline.pipe';
import { IntroComponent } from '../intro/intro.component';
import { NavigationComponent } from '../controls/navigation/navigation.component';

@NgModule({
    declarations: [
        AppComponent,
        TimelinePipe,
        DeferLoadDirective,
        TooltipDirective,
        ContactIconsComponent,
        SectionTitleComponent,
        NavigationComponent,
        IntroComponent,
        AboutComponent,
        CareerComponent,
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
