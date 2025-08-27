import { HttpClient as HttpClient} from '@angular/common/http';
import { CommonModule } from '@angular/common' ;
import { Component, OnInit ,OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { environment } from 'src/environments/environment';

import fetch from 'node-fetch';

// for OpenLayers
////import Style from 'ol/style/Style' ;
//import Draw, { createBox, createRegularPolygon } from 'ol/interaction/Draw';
////import Draw from 'ol/interaction/Draw';

/* import {createBox} from 'ol/interaction/Draw';
import {createRegularPolygon}  from 'ol/interaction/Draw';
import Map from 'ol/Map';
import Polygon from 'ol/geom/Polygon';
import View from 'ol/View';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Vector from "ol/layer/Vector"; */
//import  "ol/geom/Geometry";
/* import {transform} from 'ol/proj';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import * as proj from 'ol/proj';
import Source from 'ol/source/Source';
import Layer from 'ol/layer/Layer'; */
// import Point from 'ol/geom/Point';
/* import * as Coordinate from 'ol/coordinate';
import {fromLonLat} from 'ol/proj';
import {useGeographic} from 'ol/proj.js'; */

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-legend";

import Graphic from "@arcgis/core/Graphic.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import Point from "@arcgis/core/geometry/Point.js";
import type { ArcgisMap } from "@arcgis/map-components/components/arcgis-map";

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap'; // For custom basemap
import ImageryLayer from '@arcgis/core/layers/ImageryLayer'; // For custom imagery layer
import esriConfig from '@arcgis/core/config';
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import Extent from "@arcgis/core/geometry/Extent";



@Component({
  selector: 'app-aipredictionmodels',
//  imports: [ CommonModule ],
  templateUrl: './aipredictionmodels.component.html',
  styleUrls: ['./aipredictionmodels.component.css'],
  standalone:false
})

export class AIpredictionmodelsComponent implements OnInit, OnDestroy  {
  datasetvalue: string = "none";
  mymap: any;
  mydraw:any;
  coordinates: any;
  string_coords: any = "";
  userlon:any;
  userlat:any;
  lonlatarray:number[] = [];
  myarea:any;
  locationvalue:any = "none";
  clear_map :any = 0 ;
  blockname:any = "" ;
  //value:string ="";
  mapextent: any;
  
  //geometry = feature.getGeometry();

  /* raster = new TileLayer({
    source: new OSM(),
  });
  source = new VectorSource({ wrapX: false });
  vector:any ; */
  /* vector = new VectorLayer({
    source: this.source,
  }); */
  locradiobuttonchangevalue: any;
  useblockname: boolean = true;
  usemap: boolean = false;
  useNN: boolean = true;
  useRandomForest: boolean = false;
  cultivarvalue: string = "none";
  preddata: any;
  orgid: string = "" ;
  username: any;
  info: any;
  modelradiobutton: any;

  resultReady: boolean = false;
  prediction_string:string = "";
  modelvalue: string ="yield";

  predicted_yield:string = "";
  predicted_water_used:string = "";
  aidata: any;
  water_efficiency: number = 0;

  /* type finalpred = {
      cultivar: string;
      waterused: string;
      yield: string;
      waterefficiency:Number;
    };
  FinalPred: finalpred = [] ; */
  FinalPred: Array<{cultivar: string, waterused: string, yield: string,waterefficiency:string}> = [];
  cultivar_string: any = "";
  new_caseid: any = "";
  treatmentvalue: string = "";
  n2applied:string = "" ;

  //ESRI stuff
  @ViewChild('mapViewNode', { static: true })
  private mapViewEl!: ElementRef;
  ////private view!: MapView;
  view!: MapView;
  place: any;
  map = new Map({
          basemap: 'arcgis/imagery' // Sets the Esri World Imagery basemap
        });
  restrictedExtent: any;
  

  

//  constructor(private spinner: NgxSpinnerService, private http: HttpClient, private notification: NotificationService, private router: Router) { };
  constructor(private spinner: NgxSpinnerService, private http: HttpClient, private router: Router) { };


  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }

  ngOnInit(): void {
    this.info = localStorage.getItem("info")
    this.info = JSON.parse(this.info)
    console.log("this.info", this.info);
    ////this.createNewMap();
    //const place = this.getlonlat() ;
    this.createESRImap();
    
  }

  createESRImap(): void {
    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurCJDtVr4E7TnIeHMb1zKfqj222WiBT2tTl9bX-MjlbtbuIxvWkI9_FTznRVUtJ7OPPj9iuW1Wx4jm7lwfP21b-SICA-BHRobV8bC3Kt0y7Z40T6M89ISadEGCrTuzAdumYbEO-HZ7G8AUv_Dv69XDtmKLcErdMUo2Bt01-Xogm8TffHtnRx5DsK8lu-mmtFZgm4eeUpLM4LitKJg3r15M1k.AT1_dOw06i33"; // Replace with your actual API key
        const place = this.getlonlat() ;
        alert(this.place[1]);
        alert(this.place[0]);


        this.view = new MapView({
          container: this.mapViewEl.nativeElement,
          map: this.map,
          // center: [-118.805, 34.027], // Example center coordinates
          center: [this.place[0], this.place[1]], // Example center coordinates
          zoom: 13, // Example zoom level
          constraints: {
    geometry: this.restrictedExtent, // Set the restricted extent
    ////minZoom: 2, // Optional: Minimum zoom level allowed
    ////maxZoom: 10 // Optional: Maximum zoom level allowed
  }
        });

        if(this.usemap == true)  {
           this.createESRIInteraction();
    }
        
}

createESRIInteraction(){
    const graphicsLayer = new GraphicsLayer();
    this.map.add(graphicsLayer);

        const sketchViewModel = new SketchViewModel({
        view: this.view,
        layer: graphicsLayer,
        polygonSymbol: { // Define the symbol for the drawn polygon
            type: "simple-fill",
            color: [138, 43, 226, 0.5], // RGBA color with transparency
            outline: {
                color: "white",
                width: 1
            }
        }
    });

    sketchViewModel.create("polygon"); // Starts drawing a polygon

    sketchViewModel.on("create", function(event:any) {
  // Check if the drawing is complete
    if (event.state === "complete") {
    // Logic to handle the finished graphic
        const graphic = event.graphic;
        graphicsLayer.add(graphic);
  }
});



}


getlonlat(){
    var lon:any;
    var lat:any;
    
    var templon:any;
    var templat:any;
    
    var ymin, ymax, xmin, xmax;

    
    var latlonstr = this.locationvalue;

    if (latlonstr == null)
      latlonstr = "none";
    var comp_str = "none";
    if(latlonstr === comp_str){
   // Default
      lat = 10.95
      lon = 77.1
      this.place = [lon, lat]
   } else {
      var latlonarr = latlonstr.split(" ");
      lat = latlonarr[2]
      lon = latlonarr[4]
      this.place = [lon, lat]
   }

   if(this.datasetvalue == 'coimbatore'){
    this.restrictedExtent = new Extent({
    ymin : 76.7652,
    ymax : 77.4509,
    xmin : 10.7872,
    xmax : 11.1221,
   // spatialReference: { wkid: 4326 } // WGS84 geographic coordinate system
      });
    
    }
    if(this.datasetvalue == 'thanjavur'){
      this.restrictedExtent = new Extent({
    ymin : 78,
    ymax : 80,
    xmin : 10,
    xmax : 11,
    //spatialReference: { wkid: 4326 } // WGS84 geographic coordinate system
      });
      
      }
    
      if(this.datasetvalue == 'lubbock'){
        this.restrictedExtent = new Extent({
    ymin : -102.5,
    ymax : -101.5,
    xmin : 33.3947,
    xmax : 33.8304,
    //spatialReference: { wkid: 4326 } // WGS84 geographic coordinate system
      });
      
      }

      if(this.datasetvalue == 'kern'){
        this.restrictedExtent = new Extent({
    ymin : -119.24,
    ymax : -117.92,
    xmin : 34.91,
    xmax : 35.2,
    //spatialReference: { wkid: 4326 } // WGS84 geographic coordinate system
      });
      
      }


  }    


  /* createNewMap(){  
    
    var lon:any;
    var lat:any;
    
    var templon:any;
    var templat:any;
    
    var minlon, maxlon, minlat, maxlat

    var place: any;
    
    //useGeographic();
    
    var latlonstr = this.locationvalue

    if (latlonstr == null)
      latlonstr = "none"
   //console.log("lonlatstr: ", latlonstr)
   //alert(latlonstr)
   var comp_str = "none"
   //if (latlonstr.localeCompare(comp_str) != 0){
   if(latlonstr === comp_str){
   // Default
      lat = 10.95
      lon = 77.1
      place = [lat, lon]
   } else {
      var latlonarr = latlonstr.split(" ");
      lat = latlonarr[2]
      lon = latlonarr[4]
      place = [lon, lat]
   }

   this.lonlatarray = fromLonLat([lon,lat],'EPSG:3857');
    console.log(this.lonlatarray[0]);
    console.log(this.lonlatarray[1]);
    lon = this.lonlatarray[0];
    lat = this.lonlatarray[1]; 

    if(this.datasetvalue == 'coimbatore'){
    minlon = 76.7652
    maxlon = 77.4509
    minlat = 10.7872
    maxlat = 11.1221
    const a = fromLonLat([minlon,minlat],'EPSG:3857')
    const b = fromLonLat([maxlon,maxlat],'EPSG:3857')
    this.mapextent = [a[0],a[1],b[0],b[1]];
    }
    if(this.datasetvalue == 'thanjavur'){
      minlon = 78
      maxlon = 80
      minlat = 10
      maxlat = 11
      const a = fromLonLat([minlon,minlat],'EPSG:3857')
      const b = fromLonLat([maxlon,maxlat],'EPSG:3857')
      this.mapextent = [a[0],a[1],b[0],b[1]];
      }
    
      if(this.datasetvalue == 'lubbock'){
      minlon =  -102.5
      maxlon =  -101.5
      minlat =  33.3947
      maxlat =  33.8304
      const a = fromLonLat([minlon,minlat],'EPSG:3857')
      const b = fromLonLat([maxlon,maxlat],'EPSG:3857')
      this.mapextent = [a[0],a[1],b[0],b[1]];
      }

      if(this.datasetvalue == 'kern'){
      minlon =  -119.24
      maxlon =  -117.92
      minlat =  34.91
      maxlat =  35.2
      const a = fromLonLat([minlon,minlat],'EPSG:3857')
      const b = fromLonLat([maxlon,maxlat],'EPSG:3857')
      this.mapextent = [a[0],a[1],b[0],b[1]];
      }
    
    
    //alert (mapextent);
    //console.log(mapextent)

    if(this.useblockname == true){ 
        place = [lon,lat]
       const point = new Point(place);
       var feature1 = new Feature(new Point(place))
       
       this.source.addFeature(feature1);
       this.vector = new VectorLayer({
        source: this.source,
        style: {
          'circle-radius': 5,
          'circle-fill-color': 'red',
        },
      }); 
      
    } else {
      this.vector = new VectorLayer({
        source: this.source,
      });

    }



    this.mymap = new Map({
      layers: [this.raster, this.vector],
      target: 'map',
      view: new View({
        //center: [8573440.974117048, 1229715.2544146648],
        //center: [8677393.50021071, 1072418.425384313],
        center: [lon, lat],
        zoom: 9,
        extent: this.mapextent,
      }),
    });
    if(this.usemap == true)  {
    this.createInteraction();
    }
    
   }  // end createNewMap

   createInteraction(){
    
    this.mydraw = new Draw({
      "source": this.source,
      "type": "Polygon",
    //  "geometryFunction": geomFunction,
    });
     if (this.clear_map == 0){
    this.mymap.addInteraction(this.mydraw);
    } else {
    this.mymap.removeInteraction(this.mydraw)
  } 
  this.mydraw.on('drawend', (event:any) => {
    const feature = event.feature;
    const feature_clone = feature.clone();
    const geometry = feature.getGeometry();
    const geometry_clone = feature_clone.getGeometry();
    geometry_clone.transform('EPSG:3857', 'EPSG:4326')
    this.coordinates = geometry_clone.getCoordinates();
    const nucoordinates = geometry.getCoordinates();
    //const nucoordinates = transform(coordinates[0][0],'EPSG:3857', 'EPSG:4326');
    console.log(this.coordinates); // Output the coordinates to console
    console.log(this.coordinates[0]);
    console.log(nucoordinates);
   this.string_coords = JSON.stringify(this.coordinates);
   console.log("after json stringify", this.string_coords);
    
   var mypolygon = new Polygon(nucoordinates);
   this.myarea = mypolygon.getArea();
   console.log("Area", this.myarea);

  }); 

   }  // end createInteraction */


   arcgisViewReadyChange(event: CustomEvent): void {
    const viewElement = event.target as ArcgisMap;

    const point = new Point({
      longitude: -118.38,
      latitude: 33.34,
    });

    // Create a symbol for drawing the point
    const markerSymbol = new SimpleMarkerSymbol({
      style: "triangle",
      size: 20,
      color: "red",
      outline: {
        color: "white",
        width: 2,
      },
    });

    // Create a graphic and add the geometry and symbol to it
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
    });

    viewElement.graphics.add(pointGraphic);
  }


/* Don't use  createNewMap(){
    var lon:any;
    var lat:any;
    var place: any;
    var minlon, maxlon, minlat, maxlat
    
    useGeographic();
    //alert(this.locationvalue)
    var latlonstr = this.locationvalue

    if (latlonstr == null)
       latlonstr = "none"
    //console.log("lonlatstr: ", latlonstr)
    //alert(latlonstr)
    var comp_str = "none"
    //if (latlonstr.localeCompare(comp_str) != 0){
    if(latlonstr === comp_str){
    // Default
       lat = 10.95
       lon = 77.1
       place = [lat, lon]
    } else {
       var latlonarr = latlonstr.split(" ");
       lat = latlonarr[1]
       lon = latlonarr[3]
       place = [lon, lat]
    }
    
    const point = new Point(place);
    //const point = new Point(transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'))

    var vertices = [[lon-0.1,lat+0.1], [lon+0.1, lat+0.1], [lon+0.1, lat -0.1], [lon-0.1, lat -0.1]]
    console.log("vertices", vertices)

    const mypolygon = new Polygon(vertices);

    /* console.log("lat", lat)
    console.log("lon", lon)
    console.log("point", point) */

    /* minlon = 76.78
    maxlon = 77.42
    minlat = 10.82
    maxlat = 11.09 */

    /* minlon = 70.0
    maxlon = 80.0
    minlat = 10.00
    maxlat = 11.00
    var mapextent = [minlon, minlat, maxlon, maxlat];

    
    
    var basic = new TileLayer({
      source: new OSM(),
    });

    var dotlayer = new VectorLayer({ */
      /* source: new VectorSource({
        features: [new Feature(point), new Feature(new Polygon([vertices]))],
    
      }), */
      /* source: this.source,
      style: {
        'circle-radius': 5,
        'circle-fill-color': 'red',
      },
    })

    const feature1 = new Feature({
      geometry: new Point(place),
      name: 'My Point',
    }); */
    /* var feature1 = new Feature(new Point(place))
    var Feature1 = new Feature({
      name: "Points",
      geometry: feature1
  }); */

  /* const feature2 = new Feature({
    geometry: new Polygon([vertices]),
    name: 'My Polygon',
  }); */
  

    //this.geometry = Feature.getGeometry();
    //var feature2 = new Feature(this.geometry : new Polygon([vertices]));
    //var Feature2 = new Feature({
    //   name: "Square",
    //   geometry: feature2
    //});
    //this.source.addFeature(feature1);
    //this.source.addFeature(feature2);

    /* var rectlayer = new VectorLayer({
      source: new VectorSource({
        features: [new Feature(new Polygon([vertices]))],
        
      }),
    })

    this.mymap = new Map({
      //layers: [this.raster, this.vector],

      target: 'map',
      //layers: [basic, dotlayer],
    
      layers: [
        new TileLayer({
          source: new OSM(),
        }), */
        /* new VectorLayer({
          source: new VectorSource({
            features: [new Feature(point)],
          }),
          style: {
            'circle-radius': 5,
            'circle-fill-color': 'red',
          },
        }), */
        /* new VectorLayer({
          source: new VectorSource({
            features: [new Feature(new Polygon(vertices))],
          }),
        }), */
        /* new VectorLayer({
          source: new VectorSource({
            features: [new Feature(mypolygon)],
          }),
        }),
      ],

      view: new View({
        //center: [8573440.974117048, 1229715.2544146648],
        //center: [8677393.50021071, 1072418.425384313],
        center: [lon, lat],
        zoom: 9,
        extent: mapextent,
      }),
      
    }); */
    //this.mymap.addLayer(dotlayer)
    //this.mymap.addLayer(rectlayer)
    
  // Adding a red point to the map at the lat , lon specified


  // } 

  onSubmit() {
    
    alert("Working on it...it will take a few seconds  :-)");
    //Validation
    if (this.datasetvalue == "none"){alert(" You must select one valid data set");location.reload();}
    if(this.useblockname == true && this.locationvalue == "none") {alert("You must select a block"); location.reload();}
    if(this.usemap == true && this.string_coords == "") {alert("You must draw a farm"); location.reload();} 
    // this.usemap
    // this.locationvalue
    // this.string_coords
    if (this.datasetvalue != "kern") {
    var n2appliedinput = document.getElementById("n2applied") as HTMLInputElement;
    this.n2applied = n2appliedinput.value;
    if (this.n2applied == '-1') {this.n2applied = '152';}
    } else { this.n2applied = '152' ;}
    var pltgdate = document.getElementById("pdate") as HTMLInputElement;
    var pdate = pltgdate.value ;
    if(pdate == "") {alert("Please enter Planting Date"); location.reload();}
    if (this.useNN == false  && this.useRandomForest == false){alert("Please select a model"); location.reload();} 
    /* var treatmentvalueinput = document.getElementById("treatment") as HTMLInputElement;
    this.treatmentvalue = treatmentvalueinput.value; */
    
    // this.useNN
    // this.useRandomForest
    ////if(this.cultivarvalue == "none" && this.datasetvalue == "coimbatore") {alert("Please select a Cultivar"); location.reload();}
    // End Validation 

    //if(this.datasetvalue == 'coimbatore'){
      if(this.useblockname == true){
        //alert(this.locationvalue)
        this.userlat = (this.locationvalue.split(" "))[2]
        this.userlon = (this.locationvalue.split(" "))[4]
        this.string_coords = this.userlat+" "+this.userlon
        this.blockname = this.locationvalue.split(" ")[0]
        //alert(this.userlat)
        //alert(this.userlon)

      } // useblockname
      else if(this.usemap == true){
        [this.userlat, this.userlon] = this.getLatLngCenter(this.coordinates)
        //this.userlat = coords[1]
        //this.userlon = coords[0]
        console.log("USERLAT");
        console.log(this.userlat)
        this.string_coords = this.userlat+" "+this.userlon

      } // use map

      
   // }
    
    console.log("One");
    
    this.username = this.info.name;
    this.username = this.username.replaceAll(" ","");


    // Create case details record and get the case id for the new record
        const CreatedDate = new Date() ;

        const timestamp: number = CreatedDate.getTime();

        var casedetials = {
              status: "Inprogress",
              fileName: "not used",
              
              XfileName: "not used",
              CULfileName: "not used",
              orgid: localStorage.getItem("org_id"),
              projectType: "AI/ML",
              projectName: localStorage.getItem("org_id") + "_" + timestamp ,
              folderType: "Not Used",
              folderName: "Not Used",
              // ocrType: this.ocrtarget_value,
              ocrType: "Various",
              targetfiles: "Not Used",
              empOrgid: localStorage.getItem("empOrgid") != '' ? localStorage.getItem("empOrgid") : null,
              searchtextwords: this.predicted_yield,
              username:this.info.name,
              CreatedDate: CreatedDate,
              selectedholosproduct: "AI/ML",
              nyers: 0,
              subblocksize: 0,
              analogyear: 0,
              plantdensity: 0,
              plantingmethod:"not used",
              farmid:0,
              farmname: this.datasetvalue,
              plantingdate: "not used"
            }
        
            console.log("AI casedetials...", casedetials);
        
            this.http.post(environment.apiUrl + "Case_Detiles/", casedetials).subscribe((res: any) => {
              if (res.errorCode == 200) {
              console.log("myresres");
              console.log('res');
              this.aidata = res.data;
              this.new_caseid = res.new_caseid;
              
/*               }              

            }) */

    // alert(this.treatmentvalue);
    // Call the predict python code
    const predjson ={
      "dataset" : this.datasetvalue ,
      "useblockname": this.useblockname,
      "usemap": this.usemap,
      "blockname": this.blockname,
      "stringcoords": this.string_coords,
      "plantingdate": pdate,
      "useNN": this.useNN,
      "useRandomForest": this.useRandomForest,
      "cultivar": this.cultivarvalue,
      "orgid" : localStorage.getItem('org_id'),
      "username" : this.username,
      "n2applied": this.n2applied,
      "what_to_predict": "yield_and_water",
      "new_caseid": this.new_caseid,
      "projectname": localStorage.getItem("org_id") + "_" + timestamp ,
      // "treatmentname": this.treatmentvalue,
    } 

    console.log(predjson);
    // alert(this.username);

    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 25 seconds */
      this.spinner.hide();
    }, 5000);


    this.resultReady = false;

    this.http.post(environment.apiUrl + 'prednow', predjson).subscribe((res: any) => {
      console.log("myresres");
      console.log('res');
      //this.preddata = res.data
      if (res.statusCode == 200) {
        console.log(" Prednow Success");
        console.log(res.c_string);
      } else {
        alert('Error in submission');
      }
      if (res.statusCode == 200) {  
        console.log("Prediction Routine Call was successful")
        alert("Prediction is now ready...Please click on 'Check Result' ")
        this.resultReady = true;
        this.prediction_string = res.prediction ;
        this.cultivar_string = res.c_string;
        //alert(res.prediction)
  
        /* this.prediction_value = this.prediction_value.replaceAll(" ", "");
        this.prediction_value = this.prediction_value.substring(1, this.prediction_value.length - 2); */
        console.log(res.prediction)
        console.log(this.prediction_string)
        console.log(this.cultivar_string)
        const test_cultivar_array = this.cultivar_string.trim().split(/\s+/);
        console.log(test_cultivar_array)
        
        this.prediction_string = this.prediction_string.replaceAll("[", "");
        this.prediction_string = this.prediction_string.replaceAll("]", "");

        const prediction_array = this.prediction_string.trim().split(/\s+/);
        console.log(prediction_array)
        var pred_yield_array:string[] = [];
        var pred_water_array:string[] = [];
        var water_efficiency_array:string[] = [];
        const pred_array_len = prediction_array.length;
        var j = 0;
        for (let i = 0; i<pred_array_len; i++){
             pred_yield_array[j] = prediction_array[i];
             i = i +1 ;
             pred_water_array[j] = prediction_array[i];
             if(Number(pred_water_array[j]) > 0){
             water_efficiency_array[j] = (Number(pred_yield_array[j])/Number(pred_water_array[j])).toFixed(2);
             } else {
                 water_efficiency_array[j] = "0" ;
             }
             j = j +1 ;
        }
        var cultivar_array:string[] = [];
        var j = 0;
        for (let i = 0; i < test_cultivar_array.length; i++) {
            cultivar_array[j] = test_cultivar_array[i];
            i = i + 1;
            j = j + 1;
          
        }
        /* if(this.datasetvalue == 'kern'){
          cultivar_array[0] = "Ara-FD7"
          cultivar_array[1] = "CFIA-FD4"
          cultivar_array[2] = "CUF-FD9"
        }
        if(this.datasetvalue == 'lubbock'){
          cultivar_array[0] = "Phytogen 350Ca1"
        }
        if(this.datasetvalue == 'coimbatore'){
          cultivar_array[0] = "ADT43"
          cultivar_array[1] = "ADT45"
          cultivar_array[2] = "CO51"
          cultivar_array[3] = "ASD16"
          cultivar_array[4] = "ADT36"
        } */
        
        for (let i = 0; i < (pred_array_len/2); i ++) {
            this.FinalPred[i] = {cultivar: cultivar_array[i] , waterused:pred_water_array[i] , yield:pred_yield_array[i] , waterefficiency:water_efficiency_array[i] }

        }
           
        console.log("FInal Pred");
        console.log(this.FinalPred);

        if(this.datasetvalue == 'coimbatore' || this.datasetvalue == 'lubbock') {
          this.predicted_yield = prediction_array[0];
          this.predicted_water_used = prediction_array[1];

        }
        

        /* if(Number(this.predicted_yield) > 0){
          this.water_efficiency = Number(this.predicted_yield)/Number(this.predicted_water_used)

        } */


      }
       
    }) 

  }
})


} 
  
  modelselectonchange(value:string) {
    this.modelvalue  = value;
    //alert(this.cultivarvalue);
  } // end model select

  treatmentselectonchange(value:string) {
    this.treatmentvalue  = value;
    // alert(this.treatmentvalue);
  } // end treatment select

  datasetselectonchange(value:string) {
    this.datasetvalue  = value;
    //this:this.datasetvalue = (document.getElementById("dataset") as HTMLInputElement).value
    //alert(this.datasetvalue);
  } // end dataset select

  cultivarselectonchange(value:string) {
    this.cultivarvalue  = value;
    //alert(this.cultivarvalue);
  } // end cultivar select

  locationselectonchange(value:string) {
    this.locationvalue  = value;
    alert(this.locationvalue);
    /* if (this.mymap){
      this.mymap.setTarget(null);
      }
    if(this.vector != null){
        this.vector.getSource()?.clear();
        }
    this.createNewMap(); */
    this.createESRImap();
       
  } // end location selection

  locradiobuttonchange(event: any) {
   
    this.locradiobuttonchangevalue = event.target.value
    //alert(this.locradiobuttonchangevalue)

    if (event.target.value == "useblockname") {
      this.useblockname = true;
      this.usemap = false;
    } else if (event.target.value == "usemap") {
      this.usemap = true;
      this.useblockname = false;
    } 
    //alert(this.usemap)
    /* if (this.mymap){
      this.mymap.setTarget(null);
      }
      this.createNewMap();    */
      this.createESRImap();
  } // end location radio button

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


  clearMap(event:any){
    /* if(this.vector != null){
    this.vector.getSource()?.clear();
    } */
    this.map.removeAll(); // This removes all operational layers and graphics
    this.createESRImap();

    } // end clearMap

  undolastpoint(event:any) {
      //// this.mydraw.removeLastPoint();   
    }  // end undolastpoint

  checkResult() {
    /*   var popup = document.getElementById("yieldPopup");
      popup.classList.toggle("show"); */
      // this.resultReady = false;
    }  

    rad2degr(rad: number) { return rad * 180 / Math.PI; }

    degr2rad(degr: number) { return degr * Math.PI / 180; }

    getLatLngCenter(latLngInDegr:any) {
      console.log(latLngInDegr);
      var LATIDX = 1;
      var LNGIDX = 0;
      var sumX = 0;
      var sumY = 0;
      var sumZ = 0;
      console.log(latLngInDegr[0].length);
      for (var i=0; i<latLngInDegr[0].length-1; i++) {
          /* console.log(latLngInDegr[0][i][LATIDX])
          console.log(latLngInDegr[0][i][LNGIDX]) */
          var lat = this.degr2rad(latLngInDegr[0][i][LATIDX]);
          var lng = this.degr2rad(latLngInDegr[0][i][LNGIDX]);
          // sum of cartesian coordinates
          sumX += Math.cos(lat) * Math.cos(lng);
          sumY += Math.cos(lat) * Math.sin(lng);
          sumZ += Math.sin(lat);
      }
  
      var avgX = sumX / latLngInDegr.length;
      var avgY = sumY / latLngInDegr.length;
      var avgZ = sumZ / latLngInDegr.length;
  
      // convert average x, y, z coordinate to latitude and longtitude
      var lng = Math.atan2(avgY, avgX);
      var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
      var lat = Math.atan2(avgZ, hyp);
  
      return ([this.rad2degr(lat), this.rad2degr(lng)]);
  }

}

