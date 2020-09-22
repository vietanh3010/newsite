import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../model/order';

@Pipe({
  name: 'countorder'
})
export class CountorderPipe implements PipeTransform {

  transform(value: Array<any>, args: any[] =null): any {
  }

}
