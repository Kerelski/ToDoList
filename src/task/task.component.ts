import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {TaskService, TaskData, Status} from '../app/services/task.service';

@Component({
  selector: 'list-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  imports: [
    DatePipe,
    NgIf,
  ],
  standalone: true
})
export class TaskComponent{

  @Input() task!: TaskData;
  @Output() selected = new EventEmitter<TaskData>();

  onSelect(): void {
    this.selected.emit(this.task);
  }
  constructor(private taskService: TaskService) {}

}
