import {Component} from '@angular/core';
import {TaskComponent} from '../task/task.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

export type Status = 'Pending' | 'Completed' | 'In Progress';

export interface TaskData{
  title: string;
  date: Date;
  status: Status;
}

@Component({
  selector: 'to-do-list',
  templateUrl: './toDoList.component.html',
  imports: [
    TaskComponent,
    NgForOf,
    FormsModule,
    NgIf,
    NgClass
  ],
  styleUrls: ['./toDoList.component.scss'],
  standalone: true
})
export class ToDoListComponent {
  tasks: TaskData[] = [];
  inputValue: string = "";
  filterText: string = "";
  startDate: Date | null = null;
  endDate: Date | null = null;
  sortByDateAsc: boolean = false;
  selectedTask: TaskData | null = null;
  powerOn: boolean = false;

  filteredTasks(): TaskData[]{
    return this.tasks.filter((task: TaskData):boolean => {
      const matchesText:boolean = this.filterText ? task.title.toLowerCase().includes(this.filterText.toLowerCase()) : true;
      const taskDate = new Date(task.date);
      const matchesStartDate:boolean = this.startDate ? taskDate >= new Date(this.startDate) : true;
      const matchesEndDate:boolean = this.endDate
        ? taskDate <= new Date(new Date(this.endDate).setDate(new Date(this.endDate).getDate() + 1))
        : true;

      return matchesText && matchesStartDate && matchesEndDate;
    });
  };

  togglePowerOn(): void {
    this.powerOn = !this.powerOn;
  }
  onTaskSelected(task: TaskData):void{
    this.selectedTask = task;
  }
  clearTaskSelected(): void {
    this.selectedTask = null;
  }
  removeTask(taskToRemove: TaskData): void{
    this.tasks = this.tasks.filter((task: TaskData):boolean => task !== taskToRemove);
    this.clearTaskSelected()
  }
  changeStatus(task: TaskData, status: Status):void{
    if(status === "In Progress"){
      task.status = status;
      task.date = new Date();
    } else if(status === "Completed"){
      task.status = status;
      task.date = new Date();
    }
    this.clearTaskSelected()
  }


  sortByDate(): void {
    this.sortByDateAsc = !this.sortByDateAsc;
    this.tasks.sort((a: TaskData, b: TaskData): number => {
      return this.sortByDateAsc
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    });
  }
  addTask(): void{
    if(this.inputValue.trim()){
      this.tasks.push({
        title: this.inputValue.trim(),
        date: new Date(),
        status: "Pending",
      });
      this.inputValue = "";
    }
  }




  get filteredPendingTasks():TaskData[] {
    return this.filteredTasks().filter((t:TaskData):boolean => t.status === 'Pending');
  }

  get filteredInProgressTasks():TaskData[]  {
    return this.filteredTasks().filter((t:TaskData):boolean => t.status === 'In Progress');
  }

  get filteredCompletedTasks():TaskData[]  {
    return this.filteredTasks().filter((t:TaskData):boolean => t.status === 'Completed');
  }
}
