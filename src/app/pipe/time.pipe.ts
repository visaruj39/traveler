import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'time'})
export class timePipe implements PipeTransform {
  transform(value: string): string {
    let time = value
    if(time == ''){
      time = '0 นาที'
    }
    if(time == '30'){
      time = '30นาที'
    }
    if(time == '60'){
      time = '1 ชั่วโมง'
    }
    if(time == '120'){
      time = '2 ชั่วโมง'
    }
    if(time == '180'){
      time = '3 ชั่วโมง'
    }
    if(time == '240'){
      time = '4 ชั่วโมง'
    }
    if(time == '300'){
      time = '5 ชั่วโมง'
    }
    if(time == '360'){
      time = '6 ชั่วโมง'
    }
    if(time == '420'){
      time = '7 ชั่วโมง'
    }
    if(time == '480'){
      time = '8 ชั่วโมง'
    }

    return time
  }
}