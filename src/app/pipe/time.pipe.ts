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
    if(time == '90'){
      time = '1.30 ชั่วโมง'
    }
    if(time == '120'){
      time = '2 ชั่วโมง'
    }
    if(time == '150'){
      time = '2.30 ชั่วโมง'
    }
    if(time == '180'){
      time = '3 ชั่วโมง'
    }
    if(time == '210'){
      time = '3.30 ชั่วโมง'
    }
    if(time == '240'){
      time = '4 ชั่วโมง'
    }
    if(time == '270'){
      time = '4.30 ชั่วโมง'
    }
    if(time == '300'){
      time = '5 ชั่วโมง'
    }
    if(time == '330'){
      time = '5.30 ชั่วโมง'
    }
    if(time == '360'){
      time = '6 ชั่วโมง'
    }
    if(time == '390'){
      time = '6.30 ชั่วโมง'
    }
    if(time == '420'){
      time = '7 ชั่วโมง'
    }
    if(time == '450'){
      time = '7.30 ชั่วโมง'
    }
    if(time == '480'){
      time = '8 ชั่วโมง'
    }
    if(time == '510'){
      time = '8.30 ชั่วโมง'
    }
    if(time == '540'){
      time = '9 ชั่วโมง'
    }
    if(time == '570'){
      time = '9.30 ชั่วโมง'
    }
    if(time == '600'){
      time = '10 ชั่วโมง'
    }
    if(time == '630'){
      time = '10.30 ชั่วโมง'
    }
    if(time == '660'){
      time = '11 ชั่วโมง'
    }
    if(time == '690'){
      time = '11.30 ชั่วโมง'
    }
    if(time == '720'){
      time = '12 ชั่วโมง'
    }
    return time
  }
}