import { Route } from '@angular/router';
import { TasksListComponent } from './tasks/tasks-list/tasks-list.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
  { path: 'movies', component: TasksListComponent },
  // Add more routes as needed
];