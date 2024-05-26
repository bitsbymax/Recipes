import { NgModule } from '@angular/core';
import { CmpPlaceholderDirective } from './cmp-placeholder.directive';
import { DropdownDirective } from './dropdown.directive';

@NgModule({
  declarations: [
    CmpPlaceholderDirective,
    DropdownDirective
  ],
  imports: [],
  exports: [
    CmpPlaceholderDirective,
    DropdownDirective
  ]
})
export class SharedModule { }