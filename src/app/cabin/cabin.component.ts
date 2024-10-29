import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatService } from '../seat.service';
@Component({
  selector: 'app-cabin',
  standalone: true,
  imports : [CommonModule],
  templateUrl: './cabin.component.html',
  styleUrls: ['./cabin.component.css']
})
export class CabinComponent implements OnInit {
  
  constructor(private seatService: SeatService) {}

  totalSeats = 80;
  seatsPerRow = 7;
  lastRowSeats = 3;
  seatsAllotted : Array<Number> = [];

  ngOnInit() {
    this.seatService.seatsAllotted$.subscribe(seats => {
      this.seatsAllotted = seats; // Update the component state with the latest seats
    });
  }


  getCabinSeats() {
    const rows = Math.ceil(this.totalSeats / this.seatsPerRow);
    const cabinSeats = [];
    let seatIndex = 1;

    for (let row = 0; row < rows; row++) {
      const rowSeats = row === rows - 1 ? this.lastRowSeats : this.seatsPerRow;
      const seatRow = [];

      for (let seat = 0; seat < rowSeats; seat++) {
        seatRow.push(seatIndex++);
      }

      cabinSeats.push(seatRow);
    }

    return cabinSeats;
  }

  isSeatAllocated(seatIndex: number): boolean {
    return this.seatsAllotted.includes(seatIndex);
  }
}
