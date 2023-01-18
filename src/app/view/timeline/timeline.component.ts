import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { GoogleMapsAPIWrapper, MapsAPILoader, Polyline, PolylineOptions, AgmInfoWindow } from '@agm/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Observable, of } from 'rxjs';
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
  stayTime = [
    "30 นาที",
    "1 ชั่วโมง",
    "2 ชั่วโมง",
    "3 ชั่วโมง",
    "4 ชั่วโมง",
    "5 ชั่วโมง",
    "6 ชั่วโมง",
    "7 ชั่วโมง",
    "8 ชั่วโมง",
  ]
  // routeTravel : Observable<any[]>;
  routeTravel
  // zoom: number;
  address: string;
  name: string;
  travelTime
  private geoCoder;

  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;
  // @ViewChild("source",{ static: false })
  // public sourceElementRef: ElementRef;
  @ViewChild("mapView", { static: false })
  public mapElementRef: ElementRef;

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
    private dataService: DataService,
  ) { }


  ngOnInit() {
    this.sendLocation = this.dataService.getData();
    this.dateTime = this.dataService.getTime();

    route = this.sendLocation
    console.log("route", route)
    if (route == undefined || !route) {
      this.router.navigate([`/home`])
    }
    this.routeTravel = route
    console.log("this.routeTravel123",this.routeTravel)
   
    this.setRouteLoop()
    
    if (route) {
      this.originMap = { lat: route[0].lat, lng: route[0].lng };
      this.destinationMap = { lat: route[route.length - 1].lat, lng: route[route.length - 1].lng };
      console.log("Back", this.waypoints)
      this.mapsAPILoader.load().then(() => {
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
    console.log("start1", this.sendLocation.latS)
    let start = this.getAddress(this.sendLocation.latS, this.sendLocation.lngS)
    console.log("start", start)
  }

  waypointLoop() {
    let data = {
      location: { lat: this.markerLat, lng: this.markerLng },
      stopover: false,
    }
    console.log("data", data)

    this.loopData.push(data)
    this.waypoints = [...this.waypoints, ... this.loopData];
    console.log("this.waypoints", this.waypoints)

  }

  remove(index) {
    console.log(index)
    route.splice(index, 1); 
  }

  // findNearbyLocations() {
  //   var lat = this.markerLat;
  //   var lng = this.markerLng;

  //   const mapDiv = document.createElement('div');

  //   const map = new google.maps.Map(mapDiv, {
  //     center: { lat: lat, lng: lng },
  //     zoom: 13
  //   });

  //   this.gmapsApi.getNativeMap().then(map => {
  //     let request = {
  //       location: map.getCenter(),
  //       radius: 500,
  //       // type: ['restaurant']
  //     };
  //     let service = new google.maps.places.PlacesService(map);
  //     service.nearbySearch(request, (results, status) => {
  //       if (status == google.maps.places.PlacesServiceStatus.OK) {
  //         console.log(results);
  //       }
  //     });
  //   });
  // }


  calculationDistance(source,destination,index) {
    console.log("Infunc")
    var source, destination;
            //*********DISTANCE AND DURATION**********************//
            console.log("source",source)
            console.log("destination",destination)
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
                    var distance = (response.rows[0].elements[0].distance.value/1000).toFixed(2);
                    var travelTime = (response.rows[0].elements[0].duration.value/60).toFixed(0);
                    console.log(distance)
                    console.log(travelTime)
                    testRoute.push({distance,travelTime})
                    route[index] = {...route[index],distance,travelTime}
            
                    console.log(">>>>>>>>>>>>>>",route)
                    return {distance,travelTime}
                } else {
                    alert("Unable to find the distance via road.");
                }
            });
          
  }

  setRouteLoop(){
    testRoute = []
    console.log("this.route",route)
    if(route.length >= 2){
      for(let i = 0; i < route.length-1; i++) {
        this.calculationDistance(route[i],route[i+1],i)
      }
      console.log("test",testRoute)
    }
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
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log("results[0]",results[0]);

          var request1 = {
            query: this.address,
            fields: ['name', 'geometry', 'photos']
          };
          console.log("request1",request1)
          service.findPlaceFromQuery(request1, (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              console.log("resultsIn",results[0]);
              this.name = results[0].name
              console.log("name",this.name)
              !results[0].photos ? this.imagePlace = '' : this.imagePlace = results[0].photos[0].getUrl({ 'maxWidth': 110, 'maxHeight': 150 })
              var lastIndex = route.length - 1
              
              let data = {
                nameLocation: this.name,
                address: this.address,
                lat: this.markerLat,
                lng: this.markerLng,
                time: this.mapSetTimeForm.value.stayTime,
                availableTime: this.itTime,
                distance: this.addDistance,
                travelTime: this.travelTime,
                image: this.imagePlace
              }
              
              route.splice(lastIndex, 0, data)
              this.setRouteLoop()
              this.waypointLoop()
            }
          });
        }
        
      });
    });

  }

  async addNewLocationBySearch() {
    var lat = this.latitude;
    var lng = this.longitude;
    console.log("lat",lat)
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
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log("results[0]",results[0]);

          var request1 = {
            query: this.address,
            fields: ['name', 'geometry', 'photos']
          };
          console.log("request1",request1)
          service.findPlaceFromQuery(request1, (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              console.log("resultsIn",results[0]);
              this.name = results[0].name
              console.log("name",this.name)
              !results[0].photos ? this.imagePlace = '' : this.imagePlace = results[0].photos[0].getUrl({ 'maxWidth': 110, 'maxHeight': 150 })
              var lastIndex = route.length - 1
              
              let data = {
                nameLocation: this.name,
                address: this.address,
                lat: this.markerLat,
                lng: this.markerLng,
                time: this.mapSetTimeForm.value.stayTime,
                availableTime: this.itTime,
                distance: this.addDistance,
                travelTime: this.travelTime,
                image: this.imagePlace
              }
              
              route.splice(lastIndex, 0, data)
              this.setRouteLoop()
              this.waypointLoop()
            }
          });
        }
        
      });
    });

  }

  mapClick(e) {
    console.log("event", e.coords)
    this.markerLat = e.coords.lat
    this.markerLng = e.coords.lng

    this.getAddress(this.markerLat, this.markerLng);

  }

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

  setZeroLastArray(){
    
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
    moveItemInArray(route, event.previousIndex, event.currentIndex);
    this.setRouteLoop()
    console.log("route", route)
  }

}

let route = []
let testRoute = []
