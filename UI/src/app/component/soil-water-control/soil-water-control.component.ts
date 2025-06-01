import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-soil-water-control',
  imports: [ReactiveFormsModule,CommonModule],
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
  inputcsv: string = "";
  inputcsvName: any;
  modelradiobutton: any;
  useRandomForest: boolean = true;
  useNN: boolean = false;
  uploadcsv: any = [];
  uploadcsvName: any = [];
  predicted_treatment:any = [];
  LCC:any = [];
  soil_color:any = [];
  slope:any = [];
  depth:any = [];
  surf_text:any = [];
  subsurf_text:any = [];
  gravel:any = [];
  rainfall:any = [];
  treatment:any = [];

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
// input validation for single prediction
    if(this.lccvalue == "none") {alert("Please select valid LCC value");}
    if(this.soilcolorvalue == "none") {alert("Please select valid soil color");}
    if(this.slopevalue == "none") {alert("Please select valid slope value");}
    if(this.depthvalue == "none") {alert("Please select valid depth value");}
    if(this.surf_textvalue == "none") {alert("Please select valid sufrace texture");}
    if(this.subsurf_textvalue == "none") {alert("Please select valid subsurface texture");}
    if(this.gravelvalue == "none") {alert("Please select valid gravel value");}
    if(this.rainfallvalue == "none") {alert("Please select valid rainfall value");}

    if(this.slopevalue == "lessthanone") { this.slopevalue = "<1"};
    if(this.depthvalue == "lessthan25") { this.depthvalue = "<25"};
    if(this.gravelvalue == "lessorequalto35") {this.gravelvalue = "<=35"};

    if(this.rainfallvalue == "lessorequalto750") {this.rainfallvalue = "<=750"};
    if(this.rainfallvalue == "750to950") {this.rainfallvalue = "750-950"};

// create csv file for single prediction
    if(this.input_choice == 'single'){
    var comma = "," ;
    this.inputcsv = this.lccvalue;
    this.inputcsv = this.inputcsv + comma ;
    this.inputcsv = this.inputcsv + this.soilcolorvalue + comma;
    this.inputcsv = this.inputcsv + this.slopevalue + comma;
    this.inputcsv = this.inputcsv + this.depthvalue + comma;
    this.inputcsv = this.inputcsv + this.surf_textvalue + comma;
    this.inputcsv = this.inputcsv + this.subsurf_textvalue + comma;
    this.inputcsv = this.inputcsv + this.gravelvalue + comma;
    this.inputcsv = this.inputcsv + this.rainfallvalue;
    }

// input validation for multiple prediction , the csv
    

// Set up JSON for the POST call
 const predJson = {"data": this.inputcsv}

// Call api and send csv file to backend
this.http.post(environment.apiUrl + 'soilwatercontrolpred', predJson).subscribe((res: any) => {
  
  if (res.statusCode == 200) {
    console.log(" Prednow Success");
    console.log(res.name);
  } else {
    alert('Error in submission');
  }
  if (res.statusCode == 200) {  
    console.log("Prediction Routine Call was successful")
    alert("Prediction is now ready...Please click on 'Check Result' ")
    
    //alert(res.prediction)
    
    console.log(res.prediction);
    this.predicted_treatment = res.prediction.split("\n");
    const num_rows = this.predicted_treatment;
    var j = 0;
    for (let i = 0; i < num_rows; i++) {
      const temp_array = this.predicted_treatment[0].split(" ") ;
      this.LCC[j] = temp_array[0];
      this.soil_color[j] = temp_array[1];
      this.slope[j] = temp_array[2];
      this.depth[j] = temp_array[3];
      this.surf_text[j] = temp_array[4];
      this.subsurf_text[j] = temp_array[5];
      this.gravel[j] = temp_array[6];
      this.rainfall[j] = temp_array[7];
      this.treatment[j] = temp_array[8];


    }
    
  }
}) 

  }

  uploadFile(event: any) {

    const numFiles = (event.target.files).length;
    console.log("num of files", numFiles);
    
     for (let i = 0; i < numFiles; i++) {
      const reader: any = new FileReader();
      const fileInfo = event.target.files[i];
      this.uploadcsv[i] = event.target.files[i];
      this.uploadcsvName[i] = event.target.files[i].name;
      console.log("file name", this.uploadcsvName[i]);
      reader.onload=()=> {this.inputcsv = reader.result as string;};
      reader.readAsText(event.target.files[i]); 
      console.log("file data", this.inputcsv);
   }
  }

  modelradiobuttonchange(event: any) {
    
    this.modelradiobutton = event.target.value
    if (event.target.value == "NeuralNetwork") {
      this.useNN = true;
      this.useRandomForest = false;
    } else if (event.target.value == "RandomForest") {
      this.useNN = false;
      this.useRandomForest = true;
    } 
  } //end model radio button

}
