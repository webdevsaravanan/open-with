import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { map, Observable, switchMap, tap, catchError, throwError, of } from 'rxjs';
import { Task } from './task.model';
import { Movie } from './movie.model';
import { environment } from '../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'https://api.npoint.io/fe909c8a46d02f3afebe';
  private seedrProxyUrl = 'https://seedrproxy.mvcollection.workers.dev/files';

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
          tap(() => this.updateM3U()),
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
          tap(() => this.updateM3U()),
          catchError(err => {
            console.error('deleteTask failed', err);
            return throwError(() => err);
          })
        );
      })
    );
  }

  // Get files from Seedr proxy
  getSeedrFiles(): Observable<any[]> {
    return this.http.get<any[]>(this.seedrProxyUrl).pipe(
      map(res => {
        console.log('seedrFiles', res);
        return res;
      }),
      catchError(err => {
        console.error('getSeedrFiles failed', err);
        return of([]);
      })
    );
  }

  //gist related methods

  private gitApiUrl = `https://api.github.com/gists/${environment.gistId}`;
  
    private get headers(): HttpHeaders {
      return new HttpHeaders({
        Authorization: `token ${environment.githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      });
    }
  updateM3U(){
    this.getTasks().subscribe(tasks => {
      // Implementation for updating M3U  
      const movies: Movie[] = tasks.map(t => ({
        title: t.title,
        logo: t.posterUrl? t.posterUrl : '', 
        streamUrl: t.url
      }));
      this.updateGist(movies).subscribe({
        next: () => console.log('M3U updated successfully'),
        error: (err) => console.error('Failed to update M3U', err)
      }); 
    });
  }
  
    // Parse M3U text into Movie array
    parseM3U(content: string): Movie[] {
      const movies: Movie[] = [];
      const lines = content.split('\n').map(l => l.trim()).filter(l => l);
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXTINF')) {
          const titleMatch = lines[i].match(/tvg-name="([^"]+)"/);
          const logoMatch = lines[i].match(/tvg-logo="([^"]+)"/);
          const title = titleMatch ? titleMatch[1] : lines[i].split(',').pop() || '';
          const logo = logoMatch ? logoMatch[1] : '';
          const streamUrl = lines[i + 1] && !lines[i + 1].startsWith('#') ? lines[i + 1] : '';
          if (title && streamUrl) {
            movies.push({ title, logo, streamUrl });
            i++;
          }
        }
      }
      return movies;
    }
  
    // Convert Movie array to M3U text
    buildM3U(movies: Movie[]): string {
      let content = '#EXTM3U\n\n';
      for (const m of movies) {
        content += `#EXTINF:-1 tvg-name="${m.title}" tvg-logo="${m.logo}" group-title="Movies",${m.title}\n`;
        content += `${m.streamUrl}\n\n`;
      }
      return content.trim();
    }
  
    fetchMovies(): Observable<Movie[]> {
      return this.http.get<any>(this.gitApiUrl, { headers: this.headers }).pipe(
        map(gist => {
          const file = gist.files['movies.m3u'];
          return file ? this.parseM3U(file.content) : [];
        })
      );
    }
  
    updateGist(movies: Movie[]): Observable<any> {
      const body = {
        files: {
          'movies.m3u': { content: this.buildM3U(movies) }
        }
      };
      return this.http.patch(this.gitApiUrl, body, { headers: this.headers });
    }
  
    getRawUrl(): string {
      return `https://gist.githubusercontent.com/${environment.githubUsername}/raw/2b477341378bf28c5baa0eec2ad82848189d60c9/movies.m3u`;
    }

}
