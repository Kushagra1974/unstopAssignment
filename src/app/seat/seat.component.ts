import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { SeatService } from '../seat.service';

@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css']
})
export class SeatComponent implements OnInit  {
  seatForm: FormGroup;
  seatsAllotted: string = '';
  allotedSeatsArray : Array<number> = []
  totalSeats = 80;
  errorMessage: string = '';  // For error messages

  constructor(private fb: FormBuilder, private seatService: SeatService) {
    this.seatForm = this.fb.group({
      numSeats: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.seatService.seatsAllotted$.subscribe(seats => {
      this.seatsAllotted = seats.join(', '); // Update the component state with the latest seats
      
      this.allotedSeatsArray = seats
    });
  }


  allocateSeats() {
    const requestedSeats : number = this.seatForm.value.numSeats;

    // Check if requested seats exceed 7
    if (requestedSeats > 7) {
      this.errorMessage = 'Only seven seats are available';
      
      // Clear the error message after 10 seconds
      setTimeout(() => {
        this.errorMessage = '';
      }, 10000);
      
      return;
    }


    let remainingSeats = this.totalSeats - this.allotedSeatsArray.length;
    let allocatedSeats:Array<Number> = [];
    if (requestedSeats > remainingSeats) {
      this.seatsAllotted = 'Not enough seats available';
      setTimeout(() => {
        this.errorMessage = '';
      }, 10000);
      return;
    }



    this.seatService.updateSeats(requestedSeats);
  
  }
}
