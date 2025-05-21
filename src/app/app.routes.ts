import { RouterModule, Routes } from '@angular/router';
import {NgModule} from '@angular/core';
import {ToDoListComponent} from '../toDoList/toDoList.component';
import {PrimeToDoListComponent} from '../PrimeToDoList/primeToDoList.component';

export const routes: Routes = [
  {path: '', component: ToDoListComponent},
  {path: 'prime', component: PrimeToDoListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
