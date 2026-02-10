import { Component, computed, EventEmitter, inject, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Task } from '../../task.model';
import { TaskService } from '../../task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent {
  private taskService = inject(TaskService);
  private modalService = inject(NgbModal);
  @Output() openMovie= new EventEmitter<string>();

  task = input.required<Task>();
  onRemoveTaskClick(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe({
        next: () => {
        },
        error: err => {
          console.error('deleteTask error', err);
        }
      });
  }
  
  openUrl(url: string) {
    this.openMovie.emit(url);
  }
}
