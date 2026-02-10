import { Component, ElementRef, viewChild,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  private formEl = viewChild<ElementRef<HTMLFormElement>>('form');
  activeModal = inject(NgbActiveModal);
constructor(private taskService: TaskService) {}
  onAddTask(title: string, url: string) {
    if(!title || !url){
      return;
    } 
    this.taskService.addTask({id: Math.random().toString(36).substring(2, 15), title, url})
      .subscribe({
        next: () => {
          this.activeModal.close();
          this.formEl()?.nativeElement.reset();
        },
        error: err => {
          console.error('addTask error', err);
        }
      });
  }
}
