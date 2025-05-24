import {Component} from '@angular/core';
import { NgForOf, NgIf, CommonModule} from '@angular/common';
import { FormGroup, FormsModule, Validators} from '@angular/forms';
import { FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import {Router} from '@angular/router';
import {TaskService, TaskData, Status} from '../app/services/task.service';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { InputGroupModule } from 'primeng/inputgroup';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {Card} from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';

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
    DatePickerModule,
    AccordionModule,
    DropdownModule,
    InputGroupModule,
    ToastModule,
    ReactiveFormsModule,
    Card,
  ],
  providers: [
    MessageService,
  ],
  standalone: true
})
export class PrimeToDoListComponent {
  tasks$: Observable<TaskData[]>;
  sortByDateAsc: boolean;
  selectedTask$: Observable<TaskData | null>;
  addForm: FormGroup;

  constructor(private router: Router, private taskService: TaskService, private messageService: MessageService, private fb: FormBuilder) {
    this.tasks$ = this.taskService.tasks$
    this.sortByDateAsc = this.taskService.sortByDateAsc;
    this.selectedTask$= this.taskService.selectedTask$;
    this.addForm = this.fb.group({
      title: ['', [Validators.required, this.noOnlyDigitsAndMinLengthValidator]],
    })
  }
  filterText: string = "";
  startDate: Date | null = null;
  endDate: Date | null = null;

  noOnlyDigitsAndMinLengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim() ?? '';

    const errors: ValidationErrors = {};

    if (value.length < 3) {
      errors['minLength'] = { requiredLength: 3, actualLength: value.length };
    }
    if (/^\d+$/.test(value)) {
      errors['onlyDigits'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

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
    this.messageService.add({
      severity: 'success',
      summary: "Task has been removed",
      detail: `Task "${taskToRemove.title}" has been removed successfully.`
    });
    this.clearTaskSelected();
  }
  changeStatus(task: TaskData, status: Status):void{
    this.taskService.updateTask(task, status);
    this.messageService.add({
      severity: 'success',
      summary: "Task's status changed",
      detail: `Task "${task.title}" was changed to "${status}".`
    });
    this.clearTaskSelected()
  }

  sortByDate(): void {
    this.taskService.sortByDate();
    this.messageService.add({
      severity: 'info',
      summary: this.sortByDateAsc ? 'Tasks sorted descending by date' : 'Tasks sorted ascending by date',
    });
    this.sortByDateAsc = !this.sortByDateAsc;
  }
  addTask(): void {
    if (this.addForm.valid) {
      const title = this.addForm.value.title!.trim();
      this.taskService.addTask({
        title,
        date: new Date(),
        status: 'Pending',
      });
      this.messageService.add({
        severity: 'success',
        summary: 'Task added',
        detail: `Task "${title}" was added.`,
      });
      this.addForm.reset();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid input',
        detail: `Task title cannot be empty, has to be at least 3 characters long and cannot has only digits.`,
      });
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
