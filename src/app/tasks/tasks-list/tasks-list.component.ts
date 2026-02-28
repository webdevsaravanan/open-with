import { Component, inject, OnInit } from '@angular/core';
import { TaskItemComponent } from './task-item/task-item.component';
import { TaskService } from '../task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewTaskComponent } from '../new-task/new-task.component';
import { AsyncPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [TaskItemComponent, AsyncPipe]
})
export class TasksListComponent implements OnInit {
  private taskService=inject(TaskService);
  private modalService = inject(NgbModal);

  tasks = this.taskService.getTasks();
  selectedPackageName:string = "org.videolan.vlc";

  isAdmin: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isAdmin = params['user'] === 'admin';
    });
  }

  openNewTaskModal() {
    const modalRef = this.modalService.open(NewTaskComponent);  
    modalRef.componentInstance.taskAdded.subscribe((message: string) => {
      this.onTaskAdded(message);
    });
  }

  onChangePackageName(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPackageName = selectElement.value;
  }
  openWith(url: string) {
if (/android/i.test(navigator.userAgent)) {
 url="intent:"+url+"#Intent;action=android.intent.action.VIEW;type=video/*;package="+this.selectedPackageName+";end";
    window.location.href=url;
}
else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {

  window.location.href = "vlc://" + url;

} else {
  window.location.href = url; // fallback
}
  }
  onTaskDeleted(taskId: string) {
    this.tasks = this.taskService.getTasks();
  }
  onTaskAdded(message: string) {
    this.tasks = this.taskService.getTasks();
  }
}
