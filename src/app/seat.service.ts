import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  private seatsAllottedSource = new BehaviorSubject<number[]>([]);
  seatsAllotted$ = this.seatsAllottedSource.asObservable();


  
  private allotSeat(seat:number){

    let allocatedSeats = this.seatsAllottedSource.getValue();      
    // if no previous allocated seat then simply allocate and return 

    if(allocatedSeats.length ==0){
      let allotedSeats: Array<number> = []
      for(let i=1;i<=seat;i++){
        allotedSeats.push(i);
      }
      return allotedSeats;
    }

    // generate the matrix to represent the seats 
    // it is 10 * 7 in size 
    let train : Array<Array<number>> = Array(12).fill(null).map(() => Array(7).fill(0));


    //filing the matrix to indicate the occupied seat
    for(let i =0;i<allocatedSeats.length;i++){
      let filledSeat = allocatedSeats[i] -1;  
      let x = Math.floor(filledSeat/7);
      let y = Math.floor(filledSeat%7);

      train[x][y] = 1;
    }
    //calculating if the requested seat can be allocated in the same row
 
    for(let i=0;i<12;i++){
      let vacantSeatCount = 0;
      let vacantSeat: Array<number> = []
      for(let j=0;j<7;j++){
        
        // To remove the extra seat in the train which is seat number 
        if(i===11 && j > 2) continue; 
        
        if(train[i][j] === 0) {
          vacantSeatCount++
          let seatNumber = i * 7 + j+1
          vacantSeat.push(seatNumber)
        }

        if(vacantSeatCount >= seat){
          return [...allocatedSeats, ...vacantSeat.slice(0, seat)].sort((a,b)=>a-b)
        }

      }
    }
    
    let nearestSeat : Array<Array<number>> = []
    let sum =0;
    let smallestDist = 1e7
    let nearestSeatAlloted : Array<Array<number>> = []
    for(let i=0;i<12;i++){
      for(let j=0;j<7;j++){

        if(i===11 && j > 2) continue; 
        if(train[i][j]  === 0){
          nearestSeat = [...nearestSeat , [i,j]]
          sum = sum + i + j;
          if(nearestSeat.length === seat){
            let calSum = sum - seat*(nearestSeat[0][0] + nearestSeat[0][0])
            if(smallestDist > calSum){
              smallestDist = calSum
              nearestSeatAlloted = nearestSeat;
            }
            sum = sum - nearestSeat[0][0] - nearestSeat[0][1];
          }
        }
      }
    }
    let output = []

    for(let i=0;i<nearestSeatAlloted.length ;i++){
      let seat = nearestSeatAlloted[i]
      let num = seat[0]*7 + seat[1] +1 ;
      output.push(num);
    }
    return [...allocatedSeats , ...output].sort((a,b)=>a-b);
  }

  updateSeats(seats: number) {
    
    const allocatedSeats: Array<number> = this.allotSeat(seats)
    this.seatsAllottedSource.next(allocatedSeats);
  }

  strictBook(seats : Array<number>){
    let allocatedSeats = this.seatsAllottedSource.getValue();
    this.seatsAllottedSource.next([...seats , ...allocatedSeats].sort((a,b)=>a-b))
  } 
}
