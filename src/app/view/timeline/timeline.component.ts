import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { GoogleMapsAPIWrapper, MapsAPILoader, Polyline, PolylineOptions, AgmInfoWindow } from '@agm/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, FormControlName } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import * as moment from 'moment'

declare var $;
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  route = []
  mapSetTimeForm: FormGroup;
  mapSetTimeSearchForm: FormGroup;
  // searchMap: FormGroup;
  editDateTravel: FormGroup;
  editTime: FormGroup;

  sendLocation;
  lat = 13.736717;
  long = 100.523186;
  markerLat
  markerLng
  dateTimeFirst
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
  waypointsData = []

  stayTime = [
    {
      id: "30",
      value: "30 นาที"
    },
    {
      id: "60",
      value: "1 ชั่วโมง"
    },
    {
      id: "90",
      value: "1.30 ชั่วโมง"
    },
    {
      id: "120",
      value: "2 ชั่วโมง"
    },
    {
      id: "150",
      value: "2.30 ชั่วโมง"
    },
    {
      id: "180",
      value: "3 ชั่วโมง"
    },
    {
      id: "210",
      value: "3.30 ชั่วโมง"
    },
    {
      id: "240",
      value: "4 ชั่วโมง"
    },
    {
      id: "270",
      value: "4.30 ชั่วโมง"
    },
    {
      id: "300",
      value: "5 ชั่วโมง"
    },
    {
      id: "330",
      value: "5.30 ชั่วโมง"
    },
    {
      id: "360",
      value: "6 ชั่วโมง"
    },
    {
      id: "390",
      value: "6.30 ชั่วโมง"
    },
    {
      id: "420",
      value: "7 ชั่วโมง"
    },
    {
      id: "450",
      value: "7.30 ชั่วโมง"
    },
    {
      id: "480",
      value: "8 ชั่วโมง"
    },
    {
      id: "510",
      value: "8.30 ชั่วโมง"
    },
    {
      id: "540",
      value: "9 ชั่วโมง"
    },
    {
      id: "570",
      value: "9.30 ชั่วโมง"
    },
    {
      id: "600",
      value: "10 ชั่วโมง"
    },
    {
      id: "630",
      value: "10.30 ชั่วโมง"
    },
    {
      id: "660",
      value: "11 ชั่วโมง"
    },
    {
      id: "690",
      value: "11.30 ชั่วโมง"
    },
    {
      id: "720",
      value: "12 ชั่วโมง"
    },
  ]

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
  editName: boolean = false
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
    polylineOptions: {
      strokeColor: '#00B97E',
      strokeWeight: 6,
      strokeOpacity: 1
    }
  };

  data

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
  ) {
    this.formSetTime()
    this.formSetTimeSearch()
    this.formEditDate()
    this.formEditTime()
  }


  async ngOnInit() {
    this.sendLocation = this.dataService.getData();
    this.dateTimeFirst = this.dataService.getTime();
    this.route = this.sendLocation
    if (this.route == undefined || !this.route) {
      this.router.navigate([`/home`])
    }

    // this.setTime( this.route[0].availableTime, this.route[0].availableTime)

    if (this.route) {
      this.calculationDistance(this.route[0], this.route[1], 0)
      this.route = this.route.map((res) => {
        return {
          ...res,
          stayTime: this.stayTime,
          editName: false
        }
      })
      this.originMap = { lat: this.route[0].lat, lng: this.route[0].lng };
      this.destinationMap = { lat: this.route[this.route.length - 1].lat, lng: this.route[this.route.length - 1].lng };
      this.setRouteLoop()
    }
  }

  async ngAfterViewInit() {
    if (this.route) {
      await this.mapsAPILoader.load().then(() => {
        let self = this
        self.geoCoder = new google.maps.Geocoder;
        let autocomplete = new google.maps.places.Autocomplete(self.mapElementRef.nativeElement);
        autocomplete.addListener("place_changed", () => {
          self.ngZone.run(() => {
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            self.latitude = place.geometry.location.lat();
            self.longitude = place.geometry.location.lng();
            self.getAddress(self.latitude, self.longitude);
            self.zoom = 12;
          });
        });

      });
    }
  }

  checkStay() {
    var addByPin = <HTMLInputElement>document.getElementById("addByPin");
    if (this.mapSetTimeForm.value.stayTime) {
      addByPin.removeAttribute("disabled")
    }
    else {
      addByPin.setAttribute("disabled", "")
    }
  }

  checkStaySearch() {
    var addBySearch = <HTMLInputElement>document.getElementById("addBySearch");
    if (this.mapSetTimeSearchForm.value.stayTime) {
      addBySearch.removeAttribute("disabled")
    }
    else {
      addBySearch.setAttribute("disabled", "")
    }
  }

  setNewValue() {
    this.mapSetTimeForm.controls['stayTime'].setValue('')
    this.mapSetTimeSearchForm.controls['stayTime'].setValue('')
    this.mapSetTimeSearchForm.controls['searchMap'].setValue('')
    this.markerLat = ''
    this.markerLng = ''
  }

  // addItem(val) { 
  //   (this.eTime.get('list') as FormArray).push(new FormControl(val))
  // }

  formEditDate() {
    this.editDateTravel = this.formBuilder.group({
      date: [this.dateTimeFirst]
    })
  }

  formEditTime() {
    this.editTime = this.formBuilder.group({
      // stayTime: this.formBuilder.array([])
      stayTime: ['']
    })
  }

  formSetTime() {
    this.mapSetTimeForm = this.formBuilder.group({
      stayTime: ['']
    })
  }

  formSetTimeSearch() {
    this.mapSetTimeSearchForm = this.formBuilder.group({
      searchMap: [''],
      stayTime: ['']
    })
  }


  setStartEndLocation() {
    let start = this.getAddress(this.sendLocation.latS, this.sendLocation.lngS)
  }

  waypointLoop() {
    let data = {
      location: { lat: this.markerLat, lng: this.markerLng },
      stopover: false,
    }

    this.loopData.push(data)
    this.waypoints = [...this.waypoints, ... this.loopData];
  }

  remove(index) {
    this.route.splice(index, 1);
    this.switchLocation()
    this.setRouteLoop()
    this.setZeroLastArray()
  }


  changeStayTime(e, index) {
    let time = e.target.value
    this.route[index] = { ...this.route[index], time }
    // this.route[index].time = time 
    this.setRouteLoop()
  }

  setTime(startTime, travelTime, time) {
    try {
      let aws = moment(startTime).add(travelTime, "minutes").add(time, "minutes").format('YYYY-MM-DDTHH:mm:ss')
      return aws;
    } catch (e) {
    }
  }

  calculationDistance(source, destination, index) {
    // var source, destination;
    //*********DISTANCE AND DURATION**********************//
    let self = this
    return new Promise(function (resolve, reject) {
      let service = new google.maps.DistanceMatrixService();

      service.getDistanceMatrix({
        origins: [source],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, function (response, status) {
        if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
          let distance = (response.rows[0].elements[0].distance.value / 1000).toFixed(2);
          let travelTime = (response.rows[0].elements[0].duration.value / 60).toFixed(0);
          self.route[index + 1].availableTime = self.setTime(source.availableTime, travelTime, parseInt(source.time) | 0)
          testRoute.push({ distance, travelTime })
          self.route[index] = { ...self.route[index], distance, travelTime }
          // return { distance, travelTime }
          resolve({ distance, travelTime })
        } else {
          alert("Unable to find the distance via road.");
          reject(status);
        }
      });
    });
  }

  switchLocation() {
    this.originMap = { lat: this.route[0].lat, lng: this.route[0].lng };
    this.destinationMap = { lat: this.route[this.route.length - 1].lat, lng: this.route[this.route.length - 1].lng };

    const newRouteWaypoint = [...this.route];
    newRouteWaypoint.splice(0, 1);
    newRouteWaypoint.splice(-1, 1);
    for (const element of newRouteWaypoint) {
      let data = {
        location: { lat: element.lat, lng: element.lng },
        stopover: false,
      };
      this.waypointsData.push(data)
    }
    this.waypoints = this.waypointsData;
    this.waypointsData = []
  }

  async setRouteLoop() {
    testRoute = []
    if (this.route.length >= 2) {
      for (let i = 0; i < this.route.length - 1; i++) {
        await this.calculationDistance(this.route[i], this.route[i + 1], i)
      }
    }
  }

  saveTrips(){
    console.log(this.route)
  }

  async addNewLocation() {
    let lat = this.markerLat;
    let lng = this.markerLng;
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

          let request1 = {
            query: this.address,
            fields: ['name', 'geometry', 'photos']
          };
          service.findPlaceFromQuery(request1, (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              this.name = results[0].name
              !results[0].photos ? this.imagePlace = '' : this.imagePlace = results[0].photos[0].getUrl({ 'maxWidth': 110, 'maxHeight': 150 })
              let lastIndex = this.route.length - 1

              let data = {
                nameLocation: this.name,
                address: this.address,
                lat: this.markerLat,
                lng: this.markerLng,
                time: this.mapSetTimeForm.value.stayTime,
                availableTime: '',
                distance: this.addDistance,
                travelTime: this.travelTime,
                image: this.imagePlace
              }

              this.route.splice(lastIndex, 0, data)
              this.setRouteLoop()
              this.waypointLoop()
            }
          });
        }

      });
    });

  }

  async addNewLocationBySearch() {
    let lat = this.latitude;
    let lng = this.longitude;
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

          let request1 = {
            query: this.address,
            fields: ['name', 'geometry', 'photos']
          };
          service.findPlaceFromQuery(request1, (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              this.name = results[0].name
              !results[0].photos ? this.imagePlace = '' : this.imagePlace = results[0].photos[0].getUrl({ 'maxWidth': 300, 'maxHeight': 300 })
              let lastIndex = this.route.length - 1

              let data = {
                nameLocation: this.name,
                address: this.address,
                lat: lat,
                lng: lng,
                time: this.mapSetTimeSearchForm.value.stayTime,
                availableTime: '',
                distance: this.addDistance,
                travelTime: this.travelTime,
                image: this.imagePlace
              }

              this.route.splice(lastIndex, 0, data)
              this.setRouteLoop()
              this.waypointLoop()
            }
          });
        }

      });
    });

  }

  mapClick(e) {
    this.markerLat = e.coords.lat
    this.markerLng = e.coords.lng
    this.getAddress(this.markerLat, this.markerLng);
  }


  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
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

  setZeroLastArray() {
    this.route[this.route.length - 1].distance = 0
    this.route[this.route.length - 1].travelTime = 0
    // this.route[0].availableTime = this.dateTimeFirst.slice(11)
    this.route[this.route.length - 1].availableTime = ''
  }

  mapChange() {
    this.mapSearch = true
    this.mapSetTimeForm.controls['stayTime'].setValue('')
    this.mapSetTimeForm.controls['stayTime'].setValue('')
  }

  searchChange() {
    this.mapSearch = false
    this.mapSetTimeForm.controls['stayTime'].setValue('')
    this.mapSetTimeForm.controls['stayTime'].setValue('')
  }

  editStartTravel() {
    this.editDate = true
  }

  editNameTravel(i) {
    this.route[i].editName = true
  }

  saveNameLocation(movie, index) {
    let name = movie.nameLocation
    // this.dateTimeFirst = this.editDateTravel.value.date
    this.route[index].nameLocation = name
    this.setRouteLoop()
    this.route[index].editName = false
  }

  saveStartTravel() {
    this.editDate = false
    this.dateTimeFirst = this.editDateTravel.value.date
    this.route[0].availableTime = this.dateTimeFirst
    this.setRouteLoop()
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.route, event.previousIndex, event.currentIndex);
    this.route[0].availableTime = this.dateTimeFirst
    this.switchLocation()
    this.setRouteLoop()
    this.setZeroLastArray()
  }

}

let testRoute = []

