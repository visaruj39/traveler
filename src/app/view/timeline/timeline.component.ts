import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { GoogleMapsAPIWrapper, MapsAPILoader, Polyline, PolylineOptions, AgmInfoWindow } from '@agm/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';

declare var $;
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  sendLocation;
  lat = 13.736717;
  long = 100.523186;
  markerLat
  markerLng
  dateTime
  zoom = 8
  zoomInMap = 8
  distance
  origin: any;
  destination: any;
  latitude: number;
  longitude: number;
  addDistance
  imagePlace
  loopData = []
  itTime = [
    {
      time: '09:00'
    }
  ]
  // zoom: number;
  address: string;
  name: string;
  private geoCoder;

  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;
  // @ViewChild("source",{ static: false })
  // public sourceElementRef: ElementRef;
  @ViewChild("mapView", { static: false })
  public mapElementRef: ElementRef;

  route = [
    // {
    //   nameLocation: "หมู่บ้านพฤกษา13",
    //   address:"ตำบล คลองสาม อำเภอ คลองหลวง ปทุมธานี",
    //   lat: 14.0392544,
    //   lng: 100.6547922,
    //   time: '',
    //   availableTime: this.itTime,
    //   diatance: "9.00Km"
    // },
    // {
    //   nameLocation: "ฟิวเจอร์พาร์ค รังสิต",
    //   address:"ถนน พหลโยธิน ตำบล ประชาธิปัตย์ อำเภอธัญบุรี ปทุมธานี",
    //   lat: 13.9891719,
    //   lng: 100.615883,
    //   time: '',
    //   availableTime: this.itTime,
    //   diatance: "9.00Km"
    // }
  ];


  editDate: boolean = false
  mapSearch: boolean = false

  public latMap: Number = 14.0392544;
  public lngMap: Number = 100.6547922;

  public originMap
  public destinationMap

  public waypoints = []

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
  mapSetTimeForm: FormGroup;
  searchMap: FormGroup;
  editDateTravel: FormGroup;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) { }


  ngOnInit() {
    this.sendLocation = this.dataService.getData();
    this.dateTime = this.dataService.getTime();

    this.route = this.sendLocation
    console.log("this.sendLocation", this.sendLocation)
    console.log("this.dateTime", this.dateTime)

    if (this.route == undefined) {
      this.router.navigate([`/home`])
    }

    if (this.route) {
      this.originMap = { lat: this.route[0].lat, lng: this.route[0].lng };
      this.destinationMap = { lat: this.route[this.route.length - 1].lat, lng: this.route[this.route.length - 1].lng };
      console.log("Back", this.waypoints)
      this.mapsAPILoader.load().then(() => {
        // this.setCurrentLocation();
        // console.log("value",this.setCurrentLocation())
        this.geoCoder = new google.maps.Geocoder;

        let autocomplete = new google.maps.places.Autocomplete(this.mapElementRef.nativeElement);
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            console.log("this.latitude", this.latitude)
            console.log("this.longitude", this.longitude)
            this.getAddress(this.latitude, this.longitude);
            this.zoom = 12;
          });
        });
      });
    }

    this.formSetTime()
    this.formSearchMap()
    this.formEditDate()
  }

  formEditDate() {
    this.editDateTravel = this.formBuilder.group({
      date: [this.dateTime]
    })
  }

  formSetTime() {
    this.mapSetTimeForm = this.formBuilder.group({
      stayTime: ['']
    })
  }

  formSearchMap() {
    this.searchMap = this.formBuilder.group({
      map: [''],
      stayTime: ['']
    })
  }

  setStartEndLocation() {
    // let data ={
    //   nameLocation: this.name,
    //   address: this.address,
    //   lat: this.latitude,
    //   lng: this.longitude,
    //   time: this.searchMap.value.stayTime,
    //   availableTime: this.itTime,
    //   diatance: this.addDistance
    // }
    console.log("start1", this.sendLocation.latS)
    let start = this.getAddress(this.sendLocation.latS, this.sendLocation.lngS)
    // let end = this.getAddress(this.sendLocation.latE,this.sendLocation.lngE)
    console.log("start", start)
    // console.log("end",end)
  }

  waypointLoop() {
    // let routeWaypoint = [...this.route];
    // routeWaypoint.splice(0, 1);
    // routeWaypoint.splice(-1, 1);
    // console.log("routeWaypoint",routeWaypoint)

    let data = {
      location: { lat: this.markerLat, lng: this.markerLng },
      stopover: false,
    }
    console.log("data", data)

    this.loopData.push(data)
    this.waypoints = [...this.waypoints, ... this.loopData];
    console.log("this.waypoints", this.waypoints)

  }

  async addNewLocation() {
    var lat = this.markerLat;
    var lng = this.markerLng;
    await this.mapsAPILoader.load().then(() => {

      const mapDiv = document.createElement('div');

      const map = new google.maps.Map(mapDiv, {
        center: { lat: lat, lng: lng },
        zoom: 13
      });

      const service = new google.maps.places.PlacesService(map);
      const request = {
        location: { lat: lat, lng: lng },
        radius: 500,
        // type: ['restaurant']
        // fields: ['name', 'geometry', 'photos']
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

          this.name = results[0].name
          this.imagePlace = results[0].photos[0].getUrl({ 'maxWidth': 115, 'maxHeight': 115 })

          var lastIndex = this.route.length - 1
          
          let data = {
            nameLocation: this.name,
            address: this.address,
            lat: this.markerLat,
            lng: this.markerLng,
            time: this.mapSetTimeForm.value.stayTime,
            availableTime: this.itTime,
            diatance: this.addDistance,
            image: this.imagePlace
          }
          
          this.route.splice(lastIndex, 0, data)
          this.waypointLoop()
        }
        
      });
    });

  }

  addNewLocationBySearch() {
    var lastIndex = this.route.length - 1
    console.log("lastIndex", lastIndex)
    let data = {
      nameLocation: this.name,
      address: this.address,
      lat: this.latitude,
      lng: this.longitude,
      time: this.searchMap.value.stayTime,
      availableTime: this.itTime,
      diatance: this.addDistance
    }
    this.route.splice(lastIndex, 0, data)
    this.waypointLoop()
    console.log("route", this.route)
  }


  public change(event: any) {
    console.log("event", event);
    const legs = event.routes[0].legs;
    let disTotal = 0;
    legs.forEach((value: any) => {
      disTotal += value.distance.value;
    });
    console.log(`distance: ${disTotal / 1000}km`);
  }

  //  addLocation(event: any){
  //   console.log("this.latNewLocation",this.latNewLocation)
  //   this.latNewLocation = event.lat
  //   this.lngNewLocation = event.lng
  //   console.log("event",event);
  //  }


  // getDirection() {
  // this.origin = { lat: 14.038323797081812, lng: 100.65489099721118 };
  // this.destination = { lat: this.markerLat, lng: this.markerLng };
  // Location within a string
  // this.origin = 'Taipei Main Station';
  // this.destination = 'Taiwan Presidential Office';
  // }

  mapClick(e) {
    console.log("event", e.coords)
    this.markerLat = e.coords.lat
    this.markerLng = e.coords.lng

    this.getAddress(this.markerLat, this.markerLng);
    // this.getDirection();
    // this.distance = google.maps.geometry.spherical.computeDistanceBetween(this.origin, this.destination);
    // console.log("value",this.distance / 1000)
    // this.distance = this.distance / 1000
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


  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          console.log("results[0]", results[0])
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

  mapChange() {
    this.mapSearch = true
  }

  searchChange() {
    this.mapSearch = false
  }

  editStartTravel() {
    this.editDate = true
  }
  saveStartTravel() {
    this.editDate = false
    this.dateTime = this.editDateTravel.value.date
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.route, event.previousIndex, event.currentIndex);
    console.log("route", this.route)
  }

}
