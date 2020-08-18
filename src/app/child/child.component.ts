import { Component, OnDestroy,Output, EventEmitter} from '@angular/core';
import { RxjsDemoService } from '../rxjsdemo.service';
import { Subject, Observable, combineLatest } from 'rxjs';
import { scan, takeUntil, take, tap, distinctUntilChanged, withLatestFrom, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnDestroy {
  @Output() destroyMe = new EventEmitter<void>();

  onDestroy$ = new Subject<void>();

  constructor(readonly rxjsService: RxjsDemoService) {
    // This chain prints the numbers on consle as returned from
    // getEmitter.
    this.rxjsService.getEmitter().pipe(
      // Emissions will continue the chain until an Observable
      // emits a value.
      takeUntil(this.onDestroy$)
    )
    .subscribe(num => {
      console.log('all: ' + num);
    });

    // What happens when we forget takeUntil(this.onDestroy$)?
    this.rxjsService.getEmitterOdd()
    .subscribe(num => {
      console.log('odd: ' + num);
    });

    // What happens when we forget subscribe?
    this.rxjsService.getEmitterSkip(10).pipe(
      tap(num => {
        console.log('skip: ' + num);
    })
    );
    //.subscribe();
  }

  readonly limitedEmitter$: Observable<string> = this.rxjsService.getLimitedEmitter(14)
  .pipe(
    // scan:
    // argument 1:
    // Run an accumulation lambda over each emitter value (newNum)
    // and the previous accumulator value (accStr) in which the
    // return value of the lambda is the new accumulator value.
    // argument 2:
    // Initial value for accumulator
    scan((accStr, newNum) => accStr + ' ' + newNum, 'limitedEmitter')
    // 'limitedEmitter 0'
    // 'limitedEmitter 0 1'
    // [...]
    // 'limitedEmitter 0 1 2 [...] 13'
  );

  // No takeUntil(this.destroy$) is needed here? Why?

  readonly alphaEmitter$: Observable<string> = this.rxjsService.getEmitterAlpha()
  .pipe(
    scan((accStr, newLetter) => accStr + ' ' + newLetter, 'alpha')
    // 'alpha A'
    // 'alpha A B'
    // [...]
    // 'alpha A B C [...] Z'
  );

  readonly combineLatestEmitter$: Observable<string> =
  // combineLatest takes a sequence of observables and combines them into one, emitting an array
  // made of the latest value from the each respective source observable arguments in the order given.
  // NOTE: no emission will occur unless all variables in combineLatest emit at least one time.
  combineLatest([this.rxjsService.getEmitterAlpha(), this.rxjsService.getLimitedEmitter(26)])
  .pipe(
    scan((accStr, [newLetter, newNum]) => accStr + ' ' + newLetter + newNum, 'combineLatest')
  );

  readonly withLatestFrom$: Observable<string> =
  this.rxjsService.getEmitterAlpha()
  .pipe(
    // withLatestFrom combines emissions from the source observable (getEmitterAlpha) with the
    // latest emission from the observable given as an argument.
    withLatestFrom(this.rxjsService.getLimitedEmitter(26)),
    scan((accStr, [newLetter, newNum]) => accStr + ' ' + newLetter + newNum, 'withLatestFrom')
  );

  readonly combineLatestEmitterDistinct$: Observable<string> = 
  combineLatest([this.rxjsService.getEmitterAlpha(), this.rxjsService.getLimitedEmitter(26)])
  .pipe(
    // distinctUntilChanged
    distinctUntilChanged(([newLetter, newNum], [newLetter2, newNum2]) => {
      return newLetter === newLetter2 || newNum === newNum2;
    }),
    scan((accStr, [newLetter, newNum]) => accStr + ' ' + newLetter + newNum, 'combineLatestDistinct')
  );

  
  readonly switchMap$ = this.rxjsService.getLimitedEmitter(8).pipe(
    // switchMap takes as an argument a lambda (which itself has the emitted value from the
    // source observable as an argument) that returns an observable which is passed on
    // to the rest of the chain instead of the source observable.
    switchMap(value => this.rxjsService.dummyEmitter()),
    scan((accStr, newNum) => accStr + ' ' + newNum, 'switchMap'),
  );

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
