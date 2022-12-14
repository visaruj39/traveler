import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  lat = 13.736717;
  long = 100.523186;
  markerLat
  markerLng
  zoom = 8
  distance
  origin: any;
  destination: any;
  latitude: number;
  longitude: number;
  // zoom: number;
  address: string;
  name: string;
  private geoCoder;

  @ViewChild('search',{ static: false })
  public searchElementRef: ElementRef;
  route = [
    {
      nameLocation: "หมู่บ้านพฤกษา13",
      address:"ตำบล คลองสาม อำเภอ คลองหลวง ปทุมธานี "
    },
    {
      nameLocation: "ฟิวเจอร์พาร์ค รังสิต",
      address:"ถนน พหลโยธิน ตำบล ประชาธิปัตย์ อำเภอธัญบุรี ปทุมธานี"
    }
  ];
  editDate: boolean = false
  mapSearch: boolean = false
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.getDirection();

    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      // console.log("value",this.setCurrentLocation())
      this.geoCoder = new google.maps.Geocoder;
  
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
  
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });

  }

  getDirection() {
    this.origin = { lat: 14.038323797081812, lng: 100.65489099721118 };
    this.destination = { lat: this.markerLat, lng: this.markerLng };
    // Location within a string
    // this.origin = 'Taipei Main Station';
    // this.destination = 'Taiwan Presidential Office';
  }

  mapClick(e) {
    console.log("event",e.coords)
    this.markerLat = e.coords.lat
    this.markerLng = e.coords.lng
    // this.latitude = this.markerLat
    // this.longitude = this.markerLng
    // this.getAddress(this.latitude, this.longitude)
    // console.log("lat",this.latitude)
    // console.log("lng",this.longitude)
    // console.log("add",this.getAddress(this.latitude, this.longitude))
    
    this.getAddress(this.markerLat, this.markerLng);
    this.getDirection();
    // this.distance = google.maps.geometry.spherical.computeDistanceBetween(this.origin, this.destination);
    console.log("value",this.distance / 1000)
    this.distance = this.distance / 1000
  }

  // setCurrentLocation() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       this.zoom = 8;
  //       this.getAddress(this.latitude, this.longitude);
  //     });
  //   }
  // }

  addNewLocation(){
    this.route.push({
            nameLocation: this.name,
            address: this.address
    })
    console.log("route",this.route)
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          console.log("results[0]",results[0])
          this.name = results[0].address_components.long_name;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
  
    });
  }

  mapChange(){
    this.mapSearch = true
  }

  searchChange(){
    this.mapSearch = false
  }

  editStartTravel(){
    this.editDate = true
  }
  saveStartTravel(){
    this.editDate = false
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.route, event.previousIndex, event.currentIndex);
  }

}
