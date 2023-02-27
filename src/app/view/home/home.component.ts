import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { GoogleMapsAPIWrapper, MapsAPILoader, Polyline, PolylineOptions } from '@agm/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TimelineComponent } from '../timeline/timeline.component';
import { DataService } from 'src/app/service/data.service';
import { ViewportScroller } from '@angular/common';
declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  latitudeS: number;
  longitudeS: number;
  latitudeE: number;
  longitudeE: number;
  zoom = 8
  addressStart: string;
  nameStart: string;
  addressEnd: string;
  nameEnd: string;
  test = 1
  sendLocation
  imagePlaceStart
  imagePlaceEnd
  @ViewChild('start', { static: false })
  public startElementRef: ElementRef;
  @ViewChild('end', { static: false })
  public endElementRef: ElementRef;

  private startGeoCoder;
  private endGeoCoder;
  distance
  duration
  searchMap: FormGroup;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();

      this.startGeoCoder = new google.maps.Geocoder;

      let autocompleteStart = new google.maps.places.Autocomplete(this.startElementRef.nativeElement);
      autocompleteStart.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocompleteStart.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.latitudeS = place.geometry.location.lat();
          this.longitudeS = place.geometry.location.lng();
          this.getAddressStart(this.latitudeS, this.longitudeS);
          this.zoom = 12;
        });
      });
    });

    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.endGeoCoder = new google.maps.Geocoder;

      let autocompleteEnd = new google.maps.places.Autocomplete(this.endElementRef.nativeElement);
      autocompleteEnd.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocompleteEnd.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.latitudeE = place.geometry.location.lat();
          this.longitudeE = place.geometry.location.lng();
          this.getAddressEnd(this.latitudeE, this.longitudeE);
          this.zoom = 12;
        });
      });
    });
    this.formSearchMap()
  }

  formSearchMap() {
    this.searchMap = this.formBuilder.group({
      startMap: [''],
      endMap: [''],
      dateTime: [''],
    })
  }

  onClick(elementId: string): void { 
    this.viewportScroller.scrollToAnchor(elementId);
  }

  checkLetGo(){
    var element1 = <HTMLInputElement>document.getElementById("letGo");
    if(this.searchMap.value.startMap && this.searchMap.value.endMap && this.searchMap.value.dateTime){
      element1.removeAttribute("disabled")
    }
    else{
      element1.setAttribute("disabled", "")
    }
  }

  async getAddressStart(latitude, longitude) {
    this.startGeoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          // this.nameStart = results[0].address_components.long_name;
          this.addressStart = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  async getAddressEnd(latitude, longitude) {
    this.endGeoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;

          // this.nameEnd = results[0].address_components.long_name;
          this.addressEnd = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  async calculationDistance() {
    var source, destination;
            //*********DIRECTIONS AND ROUTE**********************//
            source = { lat: this.latitudeS, lng: this.longitudeS };
            destination = { lat: this.latitudeE, lng: this.longitudeE };
            //*********DISTANCE AND DURATION**********************//
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [source],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, function (response, status) {
                if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
                   distance = (response.rows[0].elements[0].distance.value/1000).toFixed(2);
                   duration = (response.rows[0].elements[0].duration.value/60).toFixed(0);  
                }
            });
           
  }
 
  async sendData() {
    let dataArray = []
    // await this.calculationDistance()

    await this.mapsAPILoader.load().then(() => {

      const mapDiv = document.createElement('div');

      const map = new google.maps.Map(mapDiv, {
        center: { lat: this.latitudeS, lng: this.longitudeS },
        zoom: 13
      });

      const service = new google.maps.places.PlacesService(map);
      const request = {
        location: { lat: this.latitudeS, lng: this.longitudeS },
        radius: 500,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var request1 = {
            query: this.addressStart,
            fields: ['name', 'geometry', 'photos']
          };
          service.findPlaceFromQuery(request1, (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              this.nameStart = results[0].name
              if(results[0].photos){
                this.imagePlaceStart = results[0].photos[0].getUrl({ 'maxWidth': 110, 'maxHeight': 150 })
              }else{
                this.imagePlaceStart = ''
              }
              // results[0].photos[0] === undefined ? this.imagePlaceStart = '' : this.imagePlaceStart = results[0].photos[0].getUrl({ 'maxWidth': 110, 'maxHeight': 150 })
              let onlyTime = this.searchMap.value.dateTime.slice(11);
              let data = {
                nameLocation: this.nameStart,
                address: this.addressStart,
                lat: this.latitudeS,
                lng: this.longitudeS,
                spendTime: '', //เวลาที่อยู่สถานที่นั้น
                arrivalTime: this.searchMap.value.dateTime, //เวลามาถึง
                distanceToNext: "",//ระยะทางที่ใช้
                travelTimeToNext: "0",//เวลาที่ใช้เดินทาง
                image: this.imagePlaceStart
              }
              dataArray.push(data)
            }
          });
        }
      });
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var request2 = {
            query: this.addressEnd,
            fields: ['name', 'geometry', 'photos']
          };
          service.findPlaceFromQuery(request2, (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              this.nameEnd = results[0].name
              if(results[0].photos){
                this.imagePlaceEnd = results[0].photos[0].getUrl({ 'maxWidth': 110, 'maxHeight': 150 })
              }else{
                this.imagePlaceEnd = ''
              }
              // !results[0].photos[0] === undefined ? this.imagePlaceEnd = '' : this.imagePlaceEnd = results[0].photos[0].getUrl({ 'maxWidth': 110, 'maxHeight': 150 })
              let data = {
                nameLocation: this.nameEnd,
                address: this.addressEnd,
                lat: this.latitudeE,
                lng: this.longitudeE,
                spendTime: '', //เวลาที่อยู่สถานที่นั้น
                arrivalTime: "", //เวลามาถึง
                distanceToNext: "",//ระยะทางที่ใช้
                travelTimeToNext:"0",//เวลาที่ใช้เดินทาง
                image: this.imagePlaceEnd
              }
              dataArray.push(data)
              this.sendLocation = dataArray
              this.ngZone.run(() => {
                this.dataService.setData(this.sendLocation);
                this.dataService.setTime(this.searchMap.value.dateTime);
                this.router.navigate([`/timeline`])
              });
            }
          });
        }

      });
    });
  }

}
var distance
var duration