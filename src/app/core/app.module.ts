import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DialogDirective } from '@directives/dialog/dialog.directive';
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
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
