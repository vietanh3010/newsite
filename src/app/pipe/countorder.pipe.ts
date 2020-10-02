import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countorder'
})
export class CountorderPipe implements PipeTransform {

  transform(value: Array<any>, args: any[] =null): any {
  }

}
