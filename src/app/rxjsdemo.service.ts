import { Injectable } from '@angular/core';
import {map, delay, take, skip, filter, takeWhile} from 'rxjs/operators';
import {of, Observable, timer, interval} from 'rxjs' ;
@Injectable({
  providedIn: 'root'
})
export class RxjsDemoService {
  constructor() { }

  getEmitter(): Observable<number> {
    // Returns an Observable instance that emits a number every 750 milliseconds,
    // incrementing by 1 each emission.
    return interval(750);

    // 0 1 2 3 4 5 ...
  }

  getLimitedEmitter(max: number): Observable<number> {
    return this.getEmitter()
      .pipe( // Use the pipe operator to pass operators in
             // order to transform emitted values.

        // The take operator will make the Observable complete
        // after emitting "max" values from getEmitter().
        take(max),
      );
   // 0 1 2 3 ... max-1
  }

  getEmitterSkip(skipCount: number): Observable<number> {
    return this.getEmitter()
      .pipe(
        // The take operator will skip "skipCount" values
        // from getEmitter() until emission begins.
        skip(skipCount),
      );
    // 5 6 7 ... (skip=5)
  }

  getEmitterOdd(): Observable<number> {
    return this.getEmitter()
      .pipe(
        // filter takes in a lambda function that returns a
        // boolean. Each value emitted from this.getEmitter()
        // will pass through filter.
        // If this lambda evaluates to true, the value
        // will be allowed to be emitted down the chain.
        filter(num => !!(num % 2)),
      );
    // 1 3 5 7 9 ...
  }

  getEmitterAlpha(): Observable<string> {
    return this.getEmitter()
      .pipe(
        // takeWhile takes in a lambda function that returns a
        // boolean. Each value emitted from this.getEmitter()
        // will pass through takeWhile.
        // If this lambda evaluates to false, the Observable
        // will stop emitting and complete.
        takeWhile(num => num < 26),

        // map takes in a lambda that returns a value.
        // Each value emitted from the getEmitter/pipe(takeWhile)
        // chain above will pass through.
        // The value returned from the lambda is the value
        // that is emitted down the chain.
        map(num => String.fromCharCode(65 + num))
      );
    // A B C D E F ... Z

    /**
     * Alternate code:
     * return this.getLimitedEmitter(26)
     *  .pipe(map(num => String.fromCharCode(65 + num)));
     */
  }

  dummyEmitter(): Observable<number|string> {
    // Returns an observable that immediately emits a
    // sequence of values in that order.
    return of(1, 2, 3, 4, 5, 'as many values as you want...');
  }
}
