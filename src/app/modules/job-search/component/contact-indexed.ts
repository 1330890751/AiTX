import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  ChangeDetectorRef,
  Renderer2,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { Platform } from '@ionic/angular';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { UtilityComponentService } from '@core/utils-component.service';

@Component({
  selector: 'contact-indexed',
  templateUrl: './contact-indexed.html',
  styleUrls: ['./contact-indexed.scss'],
})
export class ContactIndexedComponent implements OnInit, AfterViewInit {
  sidebarScrollIndex: string[] = [];
  hummerInstance: any;

  moveListener: any;
  currLetter = '';
  ref: ChangeDetectorRef;
  isTouched = false;
  @Input()
  topHeight = 0; // 点击太快时，这个值没有传正确的过来，所以设置默认值

  @Input()
  bottomHeight = 0;

  @Output()
  scrollToLetterEvent = new EventEmitter<string>();
  indexheight = '0px';
  constructor(
    @Inject(HAMMER_GESTURE_CONFIG) public hammerGestureConfig: HammerGestureConfig,
    private el: ElementRef,
    private plt: Platform,
    ref: ChangeDetectorRef,
    public render: Renderer2,
    public utilityComp: UtilityComponentService,
  ) {
    // var window = this.plt.window();
    // var doc = plt.doc();
    this.ref = ref;
    // Define Touch Events
    const supportTouch = (() => {
      return !!(
        'ontouchstart' in window ||
        ((window as any).DocumentTouch && document instanceof (window as any).DocumentTouch)
      );
    })();

    const touchEvents = {
      start: supportTouch ? 'touchstart' : 'mousedown',
      move: supportTouch ? 'touchmove' : 'mousemove',
      end: supportTouch ? 'touchend' : 'mouseup',
    };
    this.render.listen(this.el.nativeElement, touchEvents.start, (evt) => {
      this.onTouchStart(evt);
      this.el.nativeElement.querySelector('ul').classList.remove('normal');
      this.el.nativeElement.querySelector('ul').classList.add('highlight');

      this.moveListener = this.render.listen(this.el.nativeElement, touchEvents.move, (res) => {
        this.onTouchMove(res);
      });
    });

    this.render.listen(this.el.nativeElement, touchEvents.end, (evt) => {
      this.onTouchEnd(evt);
      this.moveListener();
    });
    this.sidebarScrollIndex = this.createSidebarScrollIndexByAlphabet();
  }

  onTouchStart(ev): void {
    ev.preventDefault();
    this.isTouched = true;
    if (ev.target.tagName === 'LI') {
      this.currLetter = ev.target.innerText;
      this.scrollToLetter(ev.target.innerText);
    }
  }

  onTouchMove(ev): void {
    if (!this.isTouched) return;
    ev.preventDefault();
    const target =
      String(ev.type) === 'mousemove'
        ? ev.target
        : document.elementFromPoint(ev.touches[0].pageX, ev.touches[0].pageY);
    if (target == null) return;
    if (target.tagName !== 'LI') {
      return;
    }
    this.currLetter = target.innerText;
    this.scrollToLetter(target.innerText);
  }

  onTouchEnd(ev): void {
    this.el.nativeElement.querySelector('ul').classList.remove('highlight');
    this.el.nativeElement.querySelector('ul').classList.add('normal');
    this.currLetter = '';
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    // this.topHeight使用setTimeout算的，所以这里也用
    // alert(this.topHeight);
    // setTimeout(() => {
    //   this.indexheight = document.body.clientHeight - this.topHeight - this.bottomHeight + 'px';
    // });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.topHeight = this.utilityComp.setOffsetHeight();
      this.indexheight = document.body.clientHeight - this.topHeight - this.bottomHeight + 'px';
    });
  }
  createSidebarScrollIndexByAlphabet() {
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#';
    const numbers: string[] = [];

    for (let i = 0; i < str.length; i++) {
      const nextChar = str.charAt(i);
      numbers.push(nextChar);
    }
    return numbers;
  }

  scrollToLetter(letter: string) {
    this.ref.detectChanges();
    console.log(letter);
    this.scrollToLetterEvent.emit(letter);
  }
}
