import { Pipe, PipeTransform } from '@angular/core';
import * as Moment from 'moment';

/**
 * 格式化日期
 */
@Pipe({
  name: 'moment',
  pure: false,
})
export class MomentPipe implements PipeTransform {
  transform(d: Date | Moment.Moment | string, args?: any[]): string {
    // utc add 8 hours into beijing
    if (d === '') return '';
    const rv = Moment(d).format(args[0]);
    return rv;
  }
}
