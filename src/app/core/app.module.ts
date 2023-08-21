import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DialogDirective } from '@directives/dialog.directive';
import { DialogService } from '@services/dialog.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
        DialogDirective
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule
    ],
    providers: [
        DialogService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
