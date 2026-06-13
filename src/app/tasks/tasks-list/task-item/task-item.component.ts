// src/app/tasks/tasks-list/task-item/task-item.component.ts
import { Component, EventEmitter, inject, input, Output,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Task } from '../../task.model';
import { TaskService } from '../../task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent implements OnInit {

  isAdmin: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isAdmin = params['user'] === 'admin';
    });
  }
  private taskService = inject(TaskService);
  private modalService = inject(NgbModal);

  @Output() openMovie = new EventEmitter<{ url: string; title: string }>();
  @Output() taskDeleted = new EventEmitter<string>(); // New Output EventEmitter

  task = input.required<Task>();

  onRemoveTaskClick(taskId: string) {
    const confirmation = confirm('Are you sure you want to delete this movie?');
    if (confirmation) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          console.log(`Task with ID ${taskId} deleted successfully.`);
          this.taskDeleted.emit(taskId); // Emit the event
        },
        error: err => {
          console.error('deleteTask error', err);
          alert('Failed to delete movie. Please try again.');
        }
      });
    }
  }
  
  openUrl(url: string, title: string) {
    this.openMovie.emit({ url, title });
  }
}
