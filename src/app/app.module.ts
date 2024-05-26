import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [ //компоненти, директиви, кастомні пайпи, які належать до цього модуля
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
  ], //інші модулі, які ми імпортуємо в поточний модуль
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
  }], //сервіси
  bootstrap: [AppComponent], //тут вказується компонент, який є головним і який буде вказаний в index.html
})
export class AppModule {}