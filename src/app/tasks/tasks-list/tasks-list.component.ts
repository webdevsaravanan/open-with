import { Component, inject, OnInit } from '@angular/core';
import { TaskItemComponent } from './task-item/task-item.component';
import { TaskService } from '../task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewTaskComponent } from '../new-task/new-task.component';
import { AsyncPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PlyrPlayerComponent } from '../video-player/plyr-player.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [TaskItemComponent, AsyncPipe,PlyrPlayerComponent]
})
export class TasksListComponent implements OnInit {
  private taskService=inject(TaskService);
  private modalService = inject(NgbModal);

  tasks = this.taskService.getTasks();
  selectedPackageName:string = "org.videolan.vlc";

  isAdmin: boolean = false;
  selectedUrl = '';
  showPlayer = false;
selectedMovieTitle="";
currentDownloadUrl="";
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isAdmin = params['user'] === 'admin';
    });
  }
downloadMovie(){
  window.location.href = this.currentDownloadUrl;
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
  openWith(url: string, title: string) {
if (/android/i.test(navigator.userAgent)) {
 url="intent:"+url+"#Intent;action=android.intent.action.VIEW;type=video/*;package="+this.selectedPackageName+";end";
    window.location.href=url;
}
else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {

  window.location.href = "vlc://" + url;

} else {
  //window.location.href = url; // fallback
this.currentDownloadUrl=url;
 this.selectedUrl = url;
  this.showPlayer = true;
  this.selectedMovieTitle=title;

}
  }
ClosePlayer() {
  this.showPlayer = false;
  this.selectedUrl = '';
this.currentDownloadUrl="";
  }
  onTaskDeleted(taskId: string) {
    this.tasks = this.taskService.getTasks();
  }
  onTaskAdded(message: string) {
    this.tasks = this.taskService.getTasks();
  }
copyPlaylist(){ 
    navigator.clipboard.writeText("https://gist.githubusercontent.com/webdevsaravanan/e56d8cfe808c1ee7325ade32a426afd8/raw/movies.m3u");
}
}
