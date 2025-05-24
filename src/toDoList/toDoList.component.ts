import {Component} from '@angular/core';
import {TaskComponent} from '../task/task.component';
import {NgClass, NgForOf, NgIf, CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {TaskService, TaskData, Status} from '../app/services/task.service';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';




@Component({
  selector: 'to-do-list',
  templateUrl: './toDoList.component.html',
  imports: [
    TaskComponent,
    NgForOf,
    FormsModule,
    NgIf,
    NgClass,
    CommonModule,
  ],
  styleUrls: ['./toDoList.component.scss'],
  standalone: true
})
export class ToDoListComponent {
  tasks$: Observable<TaskData[]>;
  sortByDateAsc: boolean;
  selectedTask$: Observable<TaskData | null>;
  constructor(private router: Router, private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$
    this.sortByDateAsc = this.taskService.sortByDateAsc;
    this.selectedTask$= this.taskService.selectedTask$;
  }

  inputValue: string = "";
  filterText: string = "";
  startDate: Date | null = null;
  endDate: Date | null = null;
  powerOn: boolean = false;


  goToPrime(): void {
    this.router.navigate(['/prime']);
  }

  filtered(tasks: TaskData[]): TaskData[] {
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate + 'T23:59:59.999') : null;

    return tasks
      .filter(task => {
        const matchesText = this.filterText
          ? task.title.toLowerCase().includes(this.filterText.toLowerCase())
          : true;

        const taskDate = new Date(task.date);

        const matchesStart = start ? taskDate >= start : true;
        const matchesEnd = end ? taskDate <= end : true;

        return matchesText && matchesStart && matchesEnd;
      })
      .sort((a, b) => this.taskService.sortByDateAsc
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime()
      );
  }


  togglePowerOn(): void {
    this.powerOn = !this.powerOn;
  }
  onTaskSelected(task: TaskData):void{
    this.taskService.selectTask(task)
  }
  clearTaskSelected(): void {
    this.taskService.selectTask(null);
  }
  removeTask(taskToRemove: TaskData): void{
    this.taskService.removeTask(taskToRemove);
    this.clearTaskSelected();
  }
  changeStatus(task: TaskData, status: Status):void{
    this.taskService.updateTask(task, status);
    this.clearTaskSelected()
  }

  sortByDate(): void {
    this.taskService.sortByDate();
    this.sortByDateAsc = !this.sortByDateAsc;
  }
  addTask(): void{
    if(this.inputValue.trim()){
      this.taskService.addTask({
        title: this.inputValue.trim(),
        date: new Date(),
        status: "Pending",
      });
      this.inputValue = "";
    }
  }


  get filteredPendingTasks(): Observable<TaskData[]> {
    return this.tasks$.pipe(
      map(tasks => this.filtered(tasks).filter(t => t.status === 'Pending'))
    );
  }
  get filteredInProgressTasks(): Observable<TaskData[]> {
    return this.tasks$.pipe(
      map(tasks => this.filtered(tasks).filter(t => t.status === 'In Progress'))
    );
  }

  get filteredCompletedTasks(): Observable<TaskData[]> {
    return this.tasks$.pipe(
      map(tasks => this.filtered(tasks).filter(t => t.status === 'Completed'))
    );
  }
}
