import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-soil-water-control',
  imports: [ReactiveFormsModule,],
  templateUrl: './soil-water-control.component.html',
  styleUrl: './soil-water-control.component.css'
})
export class SoilWaterControlComponent implements OnInit {
  fileUpload!: UntypedFormGroup;
  predictradiobuttonchangevalue: any;
  input_choice: string ="";
  lccvalue: string ="";
  soilcolorvalue: string ="";
  slopevalue: string = "";
  depthvalue: string = "";
  surf_textvalue: string = "";
  subsurf_textvalue: string = "";
  gravelvalue: string = "";
  rainfallvalue: string = "";
  inputcsv: any;
  inputcsvName: any;

  constructor(private fb: UntypedFormBuilder, private http: HttpClient) { }
  

  ngOnInit(): void {
    this.fileUpload = this.fb.group({
      file: ['', Validators.required]
    })

  }

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

  onSubmit() {

    alert("request submitted");
  }

  uploadFile(event: any) {

    const numFiles = (event.target.files).length;
    console.log("num of files", numFiles);
    
     for (let i = 0; i < numFiles; i++) {
      const reader: any = new FileReader();
      const fileInfo = event.target.files[i];
      this.inputcsv[i] = event.target.files[i];
      this.inputcsvName[i] = event.target.files[i].name;
      reader.readAsText(event.target.files[i]); 
      
   }
  }

}
