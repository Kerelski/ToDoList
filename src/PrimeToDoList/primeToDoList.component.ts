import {Component} from '@angular/core';
import {NgClass, NgForOf, NgIf, CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {TaskService, TaskData, Status} from '../app/services/task.service';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import {Card} from 'primeng/card';

@Component({
  selector: 'prime-to-do-list',
  templateUrl: './primeToDoList.component.html',
  styleUrls: ['./primeToDoList.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    NgForOf,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    AccordionModule,
    DropdownModule,
    Card,
  ],
  standalone: true
})
export class PrimeToDoListComponent {
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

  goToClassicList(): void {
    this.router.navigate(['']);
  }

  filtered(tasks: TaskData[]): TaskData[] {
    const start = this.startDate ? new Date(this.startDate.setHours(0, 0, 0, 0)) : null;
    const end = this.endDate ? new Date(this.endDate.setHours(23, 59, 59, 999)) : null;

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
  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
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
