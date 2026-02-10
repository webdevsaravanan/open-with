import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap, tap, catchError, throwError, of } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
private http=inject(HttpClient);

  private apiUrl = 'https://api.npoint.io/fe909c8a46d02f3afebe';

  // Get all tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
       console.log(res);
        return res.tasks || [];
      }),
      catchError(err => {
        console.error('getTasks failed', err);
        return of([]);
      })
    );
  }

  // Save a new task
  addTask(task: Task): Observable<any> {
    const now = new Date();

    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 15),
      createdOn: now,
      updatedOn: now
    };

    return this.getTasks().pipe(
      switchMap(existingTasks => {
        const updatedTasks = [...existingTasks, newTask];
        return this.http.post(this.apiUrl, { tasks: updatedTasks }).pipe(
          tap(() => console.log('addTask: tasks updated')),
          map(res => res),
          catchError(err => {
            console.error('addTask failed', err);
            return throwError(() => err);
          })
        );
      }),
      catchError(err => {
        console.error('addTask outer error', err);
        return throwError(() => err);
      })
    );
}

  // Delete a task
  deleteTask(id: string): Observable<any> {
    return this.getTasks().pipe(
      switchMap(existingTasks => {
        const updatedTasks = existingTasks.filter(t => t.id !== id);
        return this.http.post(this.apiUrl, { tasks: updatedTasks }).pipe(
          tap(() => console.log('deleteTask: tasks updated')),
          catchError(err => {
            console.error('deleteTask failed', err);
            return throwError(() => err);
          })
        );
      })
    );
  }
}
