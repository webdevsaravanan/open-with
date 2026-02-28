import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/routes' // Import your routes

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes, withComponentInputBinding()) // Configure the router
  ]
}).catch((err) => console.error(err));