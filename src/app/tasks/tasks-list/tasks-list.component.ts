import { Component, inject, signal } from '@angular/core';
import { TaskItemComponent } from './task-item/task-item.component';
import { TaskService } from '../task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewTaskComponent } from '../new-task/new-task.component';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [TaskItemComponent,AsyncPipe]
})
export class TasksListComponent {
  private taskService=inject(TaskService);
  private modalService = inject(NgbModal);

  tasks = this.taskService.getTasks();
  selectedPackageName:string = "org.videolan.vlc";
  open() {
		this.modalService.open(NewTaskComponent );
	}
  onChangePackageName(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPackageName = selectElement.value;
  }
  openWith(url: string) {
    url="intent:"+url+"#Intent;action=android.intent.action.VIEW;type=video/*;package="+this.selectedPackageName+"; end";
    window.open(url, '_blank');

  }
}
