import { Component } from '@angular/core';

@Component({
  selector: 'app-soil-water-control',
  imports: [],
  templateUrl: './soil-water-control.component.html',
  styleUrl: './soil-water-control.component.css'
})
export class SoilWaterControlComponent {
  predictradiobuttonchangevalue: any;
  input_choice: string;

  predictradiobuttonchange(event: any) {
    
    this.predictradiobuttonchangevalue = event.target.value
    this.input_choice = "Single";
    if (event.target.value == "Single") {
      this.input_choice = "Single";
    } else if (event.target.value == "Multiple") {
      this.input_choice = "Multiple";
    } 
  }








}
