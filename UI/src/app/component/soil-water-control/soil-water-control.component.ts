import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { environment } from 'src/environments/environment';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-soil-water-control',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './soil-water-control.component.html',
  styleUrl: './soil-water-control.component.css'
})
export class SoilWaterControlComponent implements OnInit {
  fileUpload!: UntypedFormGroup;
  predictradiobuttonchangevalue: any;
  input_choice: string = "";
  lccvalue: string = "none";
  soilcolorvalue: string = "none";
  slopevalue: string = "none";
  depthvalue: string = "none";
  surf_textvalue: string = "none";
  subsurf_textvalue: string = "none";
  gravelvalue: string = "none";
  rainfallvalue: string = "none";
  inputcsv: string = "";
  inputcsvName: any;
  modelradiobutton: any;
  useRandomForest: boolean = true;
  useNN: boolean = false;
  uploadcsv: any = [];
  uploadcsvName: any = [];
  predicted_treatment: any = [];
  LCC: any = [];
  soil_color: any = [];
  slope: any = [];
  depth: any = [];
  surf_text: any = [];
  subsurf_text: any = [];
  gravel: any = [];
  rainfall: any = [];
  treatment: any = [];
  temp_array: any = [];

  predict_array: string[][] = [];
  temp_prediction: any;
  // predict_array:any = {};
  resultReady: boolean = false;
  correctcsv: string = "";

  inputerror: boolean = false;


  constructor(private spinner: NgxSpinnerService, private fb: UntypedFormBuilder, private http: HttpClient) { }


  ngOnInit(): void {
    this.fileUpload = this.fb.group({
      file: ['', Validators.required]
    })

    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1000);

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

  lccselectonchange(value: string) {

    this.lccvalue = value;

  }


  soilcolorselectonchange(value: string) {

    this.soilcolorvalue = value;

  }

  slopeselectonchange(value: string) {

    this.slopevalue = value;

  }

  depthselectonchange(value: string) {

    this.depthvalue = value;

  }

  surf_textselectonchange(value: string) {

    this.surf_textvalue = value;

  }

  subsurf_textselectonchange(value: string) {

    this.subsurf_textvalue = value;

  }

  gravelselectonchange(value: string) {

    this.gravelvalue = value;

  }

  rainfallselectonchange(value: string) {

    this.rainfallvalue = value;

  }

  save_ctreatment() {
    alert("Treatment Saved");
    this.correctcsv = this.lccvalue + "," + this.soilcolorvalue + "," + this.slopevalue + "," + this.depthvalue + "," + this.surf_textvalue + "," + this.subsurf_textvalue + "," + this.gravelvalue + "," + this.rainfallvalue
    // save_string_as_file_on_server()
  }

  onSubmit() {

    this.resultReady = false;
    // input validation for single prediction
    // alert(this.lccvalue);
    if (this.input_choice == 'single') {
      if (this.lccvalue == "none") { this.inputerror = true; alert("Please select valid LCC value"); }
      if (this.lccvalue == "Non-Arable" && this.soilcolorvalue != "-") { this.inputerror = true; alert("Choose Soil Color = None for Non-Arable LCC"); }
      if (this.soilcolorvalue == "none") { this.inputerror = true; alert("Please select valid soil color"); }
      if (this.slopevalue == "none") { this.inputerror = true; alert("Please select valid slope value"); }
      if (this.depthvalue == "none") { this.inputerror = true; alert("Please select valid depth value"); }
      if (this.surf_textvalue == "none") { this.inputerror = true; alert("Please select valid sufrace texture"); }
      if (this.subsurf_textvalue == "none") { this.inputerror = true; alert("Please select valid subsurface texture"); }
      if (this.gravelvalue == "none") { this.inputerror = true; alert("Please select valid gravel value"); }
      if (this.rainfallvalue == "none") { this.inputerror = true; alert("Please select valid rainfall value"); }

      if (this.inputerror == false) {

        if (this.slopevalue == "lessthanone") { this.slopevalue = "<1" };
        if (this.depthvalue == "lessthan25") { this.depthvalue = "<25" };
        if (this.gravelvalue == "lessorequalto35") { this.gravelvalue = "<=35" };

        if (this.rainfallvalue == "lessorequalto750") { this.rainfallvalue = "<=750" };
        if (this.rainfallvalue == "750to950") { this.rainfallvalue = "750-950" };

        // create csv file for single prediction

        var comma = ",";
        this.inputcsv = this.lccvalue;
        this.inputcsv = this.inputcsv + comma;
        this.inputcsv = this.inputcsv + this.soilcolorvalue + comma;
        this.inputcsv = this.inputcsv + this.slopevalue + comma;
        this.inputcsv = this.inputcsv + this.depthvalue + comma;
        this.inputcsv = this.inputcsv + this.surf_textvalue + comma;
        this.inputcsv = this.inputcsv + this.subsurf_textvalue + comma;
        this.inputcsv = this.inputcsv + this.gravelvalue + comma;
        this.inputcsv = this.inputcsv + this.rainfallvalue;
      }
    }

    // input validation for multiple prediction , the csv
    if (this.input_choice == 'multiple') {
      if (this.inputcsv == "") { this.inputerror = true; alert("Empty CSV file"); }

    }


    if (this.inputerror == false) {
      // Set up JSON for the POST call
      const predJson = { "data": this.inputcsv }

      alert("Request Submitted and is beiong Processed");

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
          this.resultReady = true;
          //alert(res.prediction)

          console.log(res.prediction);
          this.predicted_treatment = res.prediction.split("\n");
          // this.predict_array = this.predicted_treatment.map((sentence: string) => sentence.split(' '));
          const num_rows = this.predicted_treatment.length;
          console.log(num_rows);
          var i = 0;
          var j = 0;
          for (i = 1; i < num_rows; i++) {
            this.temp_prediction = (this.predicted_treatment[i].split(","))[1];
            this.temp_array = this.predicted_treatment[i].split(/\s+/, 9);
            this.temp_array.push(this.temp_prediction);
            console.log(this.predicted_treatment[i]);
            const temp_array_length = this.temp_array.length;
            this.predict_array[i - 1] = [];
            /* console.log(temp_array_length);
            console.log(this.temp_array); */
            for (j = 1; j < temp_array_length; j++) {
              console.log(this.temp_array[j]);
              // this.predict_array[i-1]= [(i-1).toString()]

              this.predict_array[i - 1][j - 1] = this.temp_array[j];
              //  console.log(this.predict_array[i-1][j-1]);
            }
            /* this.LCC[j] = this.temp_array[0];
            this.soil_color[j] = this.temp_array[1];
            this.slope[j] = this.temp_array[2];
            this.depth[j] = this.temp_array[3];
            this.surf_text[j] = this.temp_array[4];
            this.subsurf_text[j] = this.temp_array[5];
            this.gravel[j] = this.temp_array[6];
            this.rainfall[j] = this.temp_array[7];
            this.treatment[j] = this.temp_array[8]; */


          }
          console.log(this.predict_array[0]);

        }
      }) // end of http post call
    } // end of if no input error
  } // end of OnSubmit

  uploadFile(event: any) {

    const numFiles = (event.target.files).length;
    console.log("num of files", numFiles);

    for (let i = 0; i < numFiles; i++) {
      const reader: any = new FileReader();
      const fileInfo = event.target.files[i];
      this.uploadcsv[i] = event.target.files[i];
      this.uploadcsvName[i] = event.target.files[i].name;
      console.log("file name", this.uploadcsvName[i]);
      reader.onload = () => { this.inputcsv = reader.result as string; };
      reader.readAsText(event.target.files[i]);
      console.log("file data", this.inputcsv);
    }
  }

  uploadFile2(event: any) {

    const numFiles = (event.target.files).length;
    console.log("num of files", numFiles);

    for (let i = 0; i < numFiles; i++) {
      const reader: any = new FileReader();
      const fileInfo = event.target.files[i];
      this.uploadcsv[i] = event.target.files[i];
      this.uploadcsvName[i] = event.target.files[i].name;
      console.log("file name", this.uploadcsvName[i]);
      reader.onload = () => { this.correctcsv = reader.result as string; };
      reader.readAsText(event.target.files[i]);
      console.log("file data", this.correctcsv);
      // save_string_as_file_on_server()
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
