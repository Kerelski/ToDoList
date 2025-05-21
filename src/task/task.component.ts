import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TaskData, Status} from '../toDoList/toDoList.component';
import {DatePipe, NgIf} from '@angular/common';

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
  @Output() delete: EventEmitter<void> = new EventEmitter<void>();
  @Output() statusChanged: EventEmitter<Status> = new EventEmitter<Status>();
  @Output() selected = new EventEmitter<any>();
  onSelect(): void{
    this.selected.emit(this.task);
  }

}
