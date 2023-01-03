import { Component, OnInit, ViewChild, ElementRef, NgZone,Input, AfterViewInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import { GoogleMapsAPIWrapper, MapsAPILoader ,Polyline, PolylineOptions } from '@agm/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TimelineComponent } from '../timeline/timeline.component';
import { DataService } from 'src/app/service/data.service';
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
  @ViewChild('start',{ static: false })
  public startElementRef: ElementRef;
  @ViewChild('end',{ static: false })
  public endElementRef: ElementRef;

  private startGeoCoder;
  private endGeoCoder;
  searchMap : FormGroup;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
      this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      // console.log("value",this.setCurrentLocation())
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
          console.log("this.latitude",this.latitudeS)
          console.log("this.longitude",this.longitudeS)
          this.getAddressStart(this.latitudeS, this.longitudeS);
          this.zoom = 12;
        });
      });
    });

    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      // console.log("value",this.setCurrentLocation())
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
          console.log("this.latitude",this.latitudeE)
          console.log("this.longitude",this.longitudeE)
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
  
  getAddressStart(latitude, longitude) {
    this.startGeoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          console.log("results[0]",results[0])
          this.nameStart = results[0].address_components.long_name;
          this.addressStart = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
  
    });
  }

  getAddressEnd(latitude, longitude) {
    this.endGeoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          console.log("results[0]",results[0])
          this.nameEnd = results[0].address_components.long_name;
          this.addressEnd = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
  
    });
  }

  sendData(){
    console.log(this.latitudeS,this.longitudeS)
    console.log(this.latitudeE,this.longitudeE)
    console.log(this.searchMap.value.dateTime)
    let data = {
      latS: this.latitudeS,
      lngS: this.longitudeS,
      latE: this.latitudeE,
      lngE: this.longitudeE,
      dateTime: this.searchMap.value.dateTime
    }
    this.sendLocation = data
    console.log("sss",this.sendLocation)
    this.dataService.setData(this.sendLocation);
    this.router.navigate([`/timeline`])
  }

}
