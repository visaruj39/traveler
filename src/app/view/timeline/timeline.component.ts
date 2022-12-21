import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import { GoogleMapsAPIWrapper, MapsAPILoader ,Polyline, PolylineOptions } from '@agm/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Observable } from 'rxjs';
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
  zoomInMap = 8
  distance
  origin: any;
  destination: any;
  latitude: number;
  longitude: number;
  latNewLocation
  lngNewLocation
  // zoom: number;
  address: string;
  name: string;
  private geoCoder;

  @ViewChild('search',{ static: false })
  public searchElementRef: ElementRef;
  // @ViewChild("source",{ static: false })
  // public sourceElementRef: ElementRef;
  // @ViewChild("mapView",{ static: false })
  // public mapElementRef: ElementRef;
  
  route = [
    {
      nameLocation: "หมู่บ้านพฤกษา13",
      address:"ตำบล คลองสาม อำเภอ คลองหลวง ปทุมธานี",
      lat: 14.0392544,
      lng: 100.6547922
    },
    {
      nameLocation: "ฟิวเจอร์พาร์ค รังสิต",
      address:"ถนน พหลโยธิน ตำบล ประชาธิปัตย์ อำเภอธัญบุรี ปทุมธานี",
      lat: 13.9891719,
      lng: 100.615883
    }
  ];
  editDate: boolean = false
  mapSearch: boolean = false

  public latMap: Number = 14.0392544;
  public lngMap: Number = 100.6547922;

  public originMap = { lat: 14.0392544, lng: 100.6547922 };
  public destinationMap = { lat: 13.7262848, lng: 100.5079776 };

  public waypoints = [
    {
      location: { lat: 13.9891719, lng: 100.615883 },
      stopover: false,
    },
    {
      location: { lat: 13.9608991, lng: 100.6200272 },
      stopover: false,
    }, {
      location: { lat: 13.8564217, lng: 100.5396361 },
      stopover: false,
    }
  ];

  public markerOptions = {
    origin: {
      // infoWindow: 'Origin.',
      icon: '../../../assets/img/Group 94.png',
      polylineOptions: {
        strokeColor: '#00B97E',
        strokeWeight: 6,
        strokeOpacity: 1
      }
    },
    waypoints: [
      {
        // infoWindow: `<h4>A<h4>
        // <a href='http://google.com' target='_blank'>A</a>
        // `,
        icon: '../../../assets/img/Group 95.png',

        polylineOptions: {
          strokeColor: '#00B97E',
          strokeWeight: 6,
          strokeOpacity: 1
        }
      }, {
        // infoWindow: `<h4>B<h4>
        // <a href='http://google.com' target='_blank'>B</a>
        // `,
        icon: '../../../assets/img/Group 96.png',

        polylineOptions: {
          strokeColor: '#00B97E',
          strokeWeight: 6,
          strokeOpacity: 1
        }
      },
      {
        // infoWindow: `<h4>C<h4>
        // <a href='http://google.com' target='_blank'>C</a>
        // `,
        icon: '../../../assets/img/Group 97.png',

        polylineOptions: {
          strokeColor: '#00B97E',
          strokeWeight: 6,
          strokeOpacity: 1
        }
      },
      {
        // infoWindow: `<h4>D<h4>
        // <a href='http://google.com' target='_blank'>D</a>
        // `,
        icon: '../../../assets/img/Group 98.png',

        polylineOptions: {
          strokeColor: '#00B97E',
          strokeWeight: 6,
          strokeOpacity: 1
        }
      },
      {
        // infoWindow: `<h4>E<h4>
        // <a href='http://google.com' target='_blank'>E</a>
        // `,
        icon: '../../../assets/img/Group 99.png',

        polylineOptions: {
          strokeColor: '#00B97E',
          strokeWeight: 6,
          strokeOpacity: 1
        }
      },  
      {
        // infoWindow: `<h4>F<h4>
        // <a href='http://google.com' target='_blank'>F</a>
        // `,
        icon: '../../../assets/img/Group 100.png',

        polylineOptions: {
          strokeColor: '#00B97E',
          strokeWeight: 6,
          strokeOpacity: 1
        }
      },
      {
        // infoWindow: `<h4>G<h4>
        // <a href='http://google.com' target='_blank'>G</a>
        // `,
        icon: '../../../assets/img/Group 101.png',

        polylineOptions: {
          strokeColor: '#00B97E',
          strokeWeight: 6,
          strokeOpacity: 1
        }
      },
      {
        // infoWindow: `<h4>H<h4>
        // <a href='http://google.com' target='_blank'>H</a>
        // `,
        icon: '../../../assets/img/Group 102.png',

        polylineOptions: {
          strokeColor: '#00B97E',
          strokeWeight: 6,
          strokeOpacity: 1
        }
      }
    ],
    destination: {
      // infoWindow: 'Destination',
      icon: '../../../assets/img/Group 103.png',
      polylineOptions: {
        strokeColor: '#00B97E',
        strokeWeight: 6,
        strokeOpacity: 1
      }
    },
  };

  public renderOptions = {
    suppressMarkers: true,
  };

  data 
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) { }
    

  ngOnInit() {

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

  public change(event: any) { 
    console.log("event",event);
    const legs = event.routes[0].legs;
    let disTotal = 0;
    legs.forEach((value: any) => {
      disTotal += value.distance.value;
    });
    console.log(`distance: ${disTotal/1000}km`);
 }

 addLocation(event: any){
  this.latNewLocation = event.lat
  this.lngNewLocation = event.lng
  console.log("event",event);
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
    
    this.getAddress(this.markerLat, this.markerLng);
    this.getDirection();
    this.distance = google.maps.geometry.spherical.computeDistanceBetween(this.origin, this.destination);
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
            address: this.address,
            lat: this.latNewLocation,
            lng: this.lngNewLocation
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
