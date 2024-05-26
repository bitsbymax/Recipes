import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appCmpPlaceholder]'
})
export class CmpPlaceholderDirective {

  constructor(public vcRef: ViewContainerRef) { }//публічною ми цю властивість робимо для того, щоб до неї був доступ ззовні. Для чого це потрібно? Тому що тепер ми зможемо додати директиву в певному місці темплейта і потім отримати до неї доступ через ViewChild і потім отримати доступ до цієї публічної властивості

}
