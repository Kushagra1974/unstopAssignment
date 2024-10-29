import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeatComponent } from './seat/seat.component';
import { CabinComponent } from './cabin/cabin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SeatComponent,CabinComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'assignment';
}
