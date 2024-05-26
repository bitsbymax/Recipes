import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AlertComponent } from '../components/alert/alert.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AuthComponent,
    AlertComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AuthComponent }]),
    SharedModule
  ]
})
export class AuthModule { }
