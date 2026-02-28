import { Component, EventEmitter,Output,ElementRef, viewChild,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  movieSeelected = false;
  manualMode = false;
  private formEl = viewChild<ElementRef<HTMLFormElement>>('form');
  activeModal = inject(NgbActiveModal);
  constructor(private taskService: TaskService, private movieService: MovieService) {}
  movies: any[] = [];
  searchText = '';
    @Output() taskAdded = new EventEmitter<string>(); // New Output EventEmitter
  
  search() {
    // add mode to search by title or imdbID based on checkboxes
    let searchMode = 'title';
    const imdbIdCheckbox = this.formEl()?.nativeElement.querySelector('input[name="searchby"][value="imdbID"]') as HTMLInputElement;
    if (imdbIdCheckbox && imdbIdCheckbox.checked) {
      searchMode = 'imdbID';
    }
    //alert('Searching for: ' + this.searchText + ' by ' + searchMode);
    this.movieService.searchMovie(this.searchText, searchMode)
      .subscribe(res => {
        console.log('Search results:', res);
        if(searchMode === 'imdbID') {
          this.movies = res ? [res] : [];
        } else {
          this.movies = res.Search || [];
        }
      });
  }
  onAddTask(title: string, url: string, year: string,imdbID: string,poster: string) {
    let posterUrl = "";
    if(!title || !url || !year){
      return;
    } 
    if(this.manualMode){
      posterUrl = poster;
    }
    else{
      const selectedMovie = this.movies.find(m => m.imdbID === imdbID);
      posterUrl = selectedMovie && selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : '';
    }
    this.taskService.addTask({id: Math.random().toString(36).substring(2, 15), title, url, year, posterUrl})
      .subscribe({
        next: () => {
          this.activeModal.close();
          this.formEl()?.nativeElement.reset();
          this.taskAdded.emit('Task added successfully'); // Emit the event
        },
        error: err => {
          console.error('addTask error', err);
        }
      });
  }
  onSelectMovie(movie: any) {
    // Populate the form fields with the selected movie's details
    const titleInput = this.formEl()?.nativeElement.querySelector('#title') as HTMLInputElement;
    const posterImg = this.formEl()?.nativeElement.querySelector('#poster') as HTMLImageElement;
    const yearInput = this.formEl()?.nativeElement.querySelector('#year') as HTMLInputElement;
    const imdbIDInput = this.formEl()?.nativeElement.querySelector('#imdbID') as HTMLInputElement;
  
    //Find movie by imdbID
    const selectedMovie = this.movies.find(m => m.imdbID === movie.target.value);
    if (!selectedMovie) {
      console.error('Selected movie not found');
      return;
    }
  
    if (yearInput) {
      yearInput.value = selectedMovie.Year;
    }

    if (titleInput) {
      titleInput.value = selectedMovie.Title;
    }
    if (posterImg) {
      posterImg.src = selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : '';
    }
    if (imdbIDInput) {
      imdbIDInput.value = selectedMovie.imdbID;
    }
    this.movieSeelected = true;

  }
  changeMode() {
    const manualModeCheckbox = this.formEl()?.nativeElement.querySelector('input[name="searchby"][value="manual"]') as HTMLInputElement;
    if(manualModeCheckbox && manualModeCheckbox.checked) {
      this.manualMode = true;
    } else {
      this.manualMode = false;
    }
  }
}
