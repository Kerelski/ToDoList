import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TaskComponent} from '../task/task.component';
import {ToDoListComponent} from '../toDoList/toDoList.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ToDoList';
}
