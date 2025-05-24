import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export type Status = 'Pending' | 'Completed' | 'In Progress';

export interface TaskData{
  id: number;
  title: string;
  date: Date;
  status: Status;
}

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private tasksSubject: BehaviorSubject<TaskData[]> = new BehaviorSubject<TaskData[]>([]);
  tasks$: Observable<TaskData[]> = this.tasksSubject.asObservable();
  private nextId = 1;

  private selectedTaskSubject = new BehaviorSubject<TaskData | null>(null);
  selectedTask$ = this.selectedTaskSubject.asObservable();

  sortByDateAsc = false;

  get tasks(): TaskData[] {
    return this.tasksSubject.value;
  }

  setTasks(tasks: TaskData[]): void {
    this.tasksSubject.next(tasks);
  }

  addTask(task: Omit<TaskData, 'id'>): void {
    const newTask: TaskData = { ...task, id: this.nextId++ };
    this.tasksSubject.next([...this.tasks, newTask]);
  }


  removeTask(task: TaskData): void {
    this.setTasks(this.tasks.filter((t: TaskData) => t !== task));
  }

  updateTask(task: TaskData, status: Status): void {
    const updated: TaskData[] = this.tasks.map((t: TaskData) =>
      t === task ? {...t, status, date: new Date()} : t
    );
    this.setTasks(updated);
  }


  sortByDate(): void {
    this.sortByDateAsc = !this.sortByDateAsc;
    const tasks = this.tasksSubject.getValue();
    const sortedTasks = [...tasks].sort((a, b) => {
      return this.sortByDateAsc
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    });
    this.tasksSubject.next(sortedTasks);
  }

  selectTask(task: TaskData | null) {
    this.selectedTaskSubject.next(task);
  }
}
