import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiKey = '75fb3a2';
  private baseUrl = 'https://www.omdbapi.com/';

  constructor(private http: HttpClient) {}
  searchMovie(title: string, searchMode: string = 'title'): Observable<any> {
    //alert('Searching for: ' + title + ' by ' + searchMode);
    if (searchMode === 'imdbID') {
      return this.http.get<any>(
        `${this.baseUrl}?apikey=${this.apiKey}&i=${title}`
      );
    }
    return this.http.get<any>(
      `${this.baseUrl}?apikey=${this.apiKey}&s=${title}`
    );
  }
}