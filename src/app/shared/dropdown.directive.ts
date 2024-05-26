import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {// Директива для відкривання-закривання менюшок
  @HostBinding('class.open') isOpen = false; // при значенні true - елементу, де додана наша директива, додається клас open

  @HostListener('click') toggleOpen() { //на клік міняємо значення змінної isOpen на протилежне
    this.isOpen = !this.isOpen; 
  }
  /* @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target)
      ? !this.isOpen
      : false;
  }
  constructor(private elRef: ElementRef) {} 
  ? код вище дає можливість закрити всі дропдауни на сторінці кліком на будь-який з них
  */
}
