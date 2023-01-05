import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  data: any;
  time: any;
  constructor() { }

  setData(data: any) {
    this.data = data;
  }

  setTime(data: any) {
    this.time = data;
  }

  getData() {
    return this.data;
  }

  getTime() {
    return this.time;
  }
}
