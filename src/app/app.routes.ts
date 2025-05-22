import { RouterModule, Routes } from '@angular/router';
import {NgModule} from '@angular/core';

export const routes: Routes = [
  {path: '', loadComponent: () => import('../toDoList/toDoList.component').then(m => m.ToDoListComponent)},
  {path: 'prime', loadComponent: () =>
      import('../PrimeToDoList/primeToDoList.component').then(m => m.PrimeToDoListComponent)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
