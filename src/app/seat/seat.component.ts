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
export class SeatComponent implements OnInit {
  seatForm: FormGroup;
  arrayInputForm: FormGroup;
  seatsAllotted: string = '';
  allotedSeatsArray: Array<number> = [];
  totalSeats = 80;
  errorMessage: string = '';  // For error messages

  constructor(private fb: FormBuilder, private seatService: SeatService) {
    this.seatForm = this.fb.group({
      numSeats: ['', [Validators.required, Validators.min(1)]]
    });

    // New form control for array input
    this.arrayInputForm = this.fb.group({
      seatNumbers: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.seatService.seatsAllotted$.subscribe(seats => {
      this.seatsAllotted = seats.join(', ');
      this.allotedSeatsArray = seats;
    });
  }

  allocateSeats() {
    const requestedSeats: number = this.seatForm.value.numSeats;

    // Check if requested seats exceed 7
    if (requestedSeats > 7) {
      this.errorMessage = 'Only seven seats are available';
      setTimeout(() => (this.errorMessage = ''), 10000);
      return;
    }

    if (requestedSeats < 1) {
      this.errorMessage = 'Requested seat count should be greater than 0';
      setTimeout(() => (this.errorMessage = ''), 10000);
      return;
    }

    const remainingSeats = this.totalSeats - this.allotedSeatsArray.length;
    if (requestedSeats > remainingSeats) {
      this.errorMessage = 'Not enough seats available';
      setTimeout(() => (this.errorMessage = ''), 10000);
      return;
    }

    this.seatService.updateSeats(requestedSeats);
  }

  submitArrayInput() {
    const seatNumbersString: string = this.arrayInputForm.value.seatNumbers;
    const seatNumbersArray: number[] = seatNumbersString
      .split(',')
      .map((seat) => Number(seat.trim()))
      .filter((seat) => !isNaN(seat)); 

      for(let i =0;i<seatNumbersArray.length ;i++){
        if(seatNumbersArray[i]>80 || seatNumbersArray[i]<0){
          this.errorMessage = "Please Enter a valid range"
          setTimeout(()=> (this.errorMessage = '') , 10000)
          return
        }
      }

      this.seatService.strictBook(seatNumbersArray);
  }
}
