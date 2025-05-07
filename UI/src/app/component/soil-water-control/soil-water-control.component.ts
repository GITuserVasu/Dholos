import { Component } from '@angular/core';

@Component({
  selector: 'app-soil-water-control',
  imports: [],
  templateUrl: './soil-water-control.component.html',
  styleUrl: './soil-water-control.component.css'
})
export class SoilWaterControlComponent {
  predictradiobuttonchangevalue: any;
  input_choice: string ="";
  lccvalue: string ="";
  soilcolorvalue: string ="";
  slopevalue: string;
  depthvalue: string;
  surf_textvalue: string;
  subsurf_textvalue: string;
  gravelvalue: string;
  rainfallvalue: string;

  predictradiobuttonchange(event: any) {
    
    this.predictradiobuttonchangevalue = event.target.value
    this.input_choice = "single";
    if (event.target.value == "Single") {
      this.input_choice = "single";
    } else if (event.target.value == "Multiple") {
      this.input_choice = "multiple";
    } 
  }

  lccselectonchange(value:string) {
 
    this.lccvalue  = value;
  
  }


  soilcolorselectonchange(value:string) {
 
    this.soilcolorvalue  = value;
  
  }

  slopeselectonchange(value:string) {
 
    this.slopevalue  = value;
  
  }

  depthselectonchange(value:string) {
 
    this.depthvalue  = value;
  
  }

  surf_textselectonchange(value:string) {
 
    this.surf_textvalue  = value;
  
  }

  subsurf_textselectonchange(value:string) {
 
    this.subsurf_textvalue  = value;
  
  }

  gravelselectonchange(value:string) {
 
    this.gravelvalue  = value;
  
  }

  rainfallselectonchange(value:string) {
 
    this.rainfallvalue  = value;
  
  }




}
