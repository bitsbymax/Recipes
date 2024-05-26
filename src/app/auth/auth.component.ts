import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../components/alert/alert.component';
import { CmpPlaceholderDirective } from '../shared/cmp-placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnDestroy {
  @ViewChild(CmpPlaceholderDirective, { static: false }) alertHost: CmpPlaceholderDirective; //передаючи в ViewChild нашу директиву, ViewChild буде брати перше знаходження нашої директиви в DOM і далі ми збережемо її в властивість
  loginMode = false;
  isLoading = false;
  error: string = null;
  private closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cmpFactoryResolver: ComponentFactoryResolver //цей клас вже застарілий, але ми викор. його просто як приклад
  ) { }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    const { email, password } = form.value;
    let authObservable: Observable<AuthResponseData>; //Ця змінна потрібна, аби ми могли в одному місці підписатися на результат REST колу, чи то авторизації чи реєстрації

    if (this.loginMode) {
      authObservable = this.authService.signIn(email, password);
    } else {
      authObservable = this.authService.signUp(email, password);
    }

    authObservable.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (errorMessage) => {
        this.error = errorMessage;//ця змінна непотрібна, якщо викор. showErrorAlert()
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    });

    form.reset();//для очистки полів форми
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {//Метод, в якому ми програмно, з коду, будемо викликати наш компонент AlertComponent
    const alertCmpFactory = this.cmpFactoryResolver.resolveComponentFactory(AlertComponent);// цей метод повертатиме не сам компонент а лише "фабрику" для цього компонента, тобто це по суті об'єкт, який знає, як створити AlertComponent

    const hostViewContainerRef = this.alertHost.vcRef; //зберігаємо в змінній посилання на об'єкт ViewContainerRef, який в свою чергу дає можливість взаємодіяти з місцем в нашому DOM де додана директива, яка записана в властивість alertHost

    hostViewContainerRef.clear();//очищає всі компоненти, які були відрендерені в тому місці DOM раніше
    const cmpRef = hostViewContainerRef.createComponent(alertCmpFactory);
    // hostViewContainerRef.createComponent<AlertComponent>(AlertComponent); - //?сучасний спосіб створення компонента без ComponentFactoryResolver, хоч і попередінй варіант досі працює

    cmpRef.instance.message = message;// instance дає доступ до конкретного екземпляру компонета який було створено і записано в cmpRef4 
    this.closeSub = cmpRef.instance.close.subscribe(() => {//так як close --> EventEmitter, підписуємось на подію і коли вона станеться, ми розумітимемо, що компонет вже не відображається
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
}
