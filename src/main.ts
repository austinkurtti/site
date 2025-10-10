import { CommonModule } from '@angular/common';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/core/app.component';
import { appRoutes } from './app/core/app.routes';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(
    AppComponent,
    {
        providers: [
            importProvidersFrom(BrowserModule, CommonModule),
            provideRouter(appRoutes)
        ]
    }
).catch(err => console.error(err));
