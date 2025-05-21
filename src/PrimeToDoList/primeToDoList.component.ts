import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import  {Router} from '@angular/router';

@Component({
  selector: 'prime-to-do-list',
  templateUrl: './primeToDoList.component.html',
  standalone: true,
  imports: [ButtonModule]
})
export class PrimeToDoListComponent {
 constructor(private router: Router) { }

  goToClassicList(): void {
   this.router.navigate(['']);
  }
}
