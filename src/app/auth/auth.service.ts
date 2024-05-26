import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, BehaviorSubject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<User>(null);//BehaviorSubject - дає підписникам негайний доступ до попереднього емітованого значення навіть якщо вони не були підписані на нього на момент його випуску. В нашому випадку ми отримаємо доступ до об'єкта User, який є залогінений в поточний момент навіть якщо ми підпишемось на нього після того, як об'єкт користувача був емітований. 
  private tokenExpirationTimer;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  signUp(email: string, password: string) {//метод яким ми відправляємо дані для авторизації на бекенд вперше (тобто реєструємось)
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email,
        password,
        returnSecureToken: true
      }).pipe(
        catchError(this.handleError),//аналог такого запису --> error => this.handleError(error)
        tap(resData => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn))
      );
  }

  signIn(email: string, password: string) { //метод, яким ми логінимось як вже зареєстрований юзер
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email,
        password,
        returnSecureToken: true
      }).pipe(
        catchError(this.handleError),//аналог такого запису --> error => this.handleError(error)
        tap(resData => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn))
      );
  }

  logout() {
    this.user$.next(null);
    this.router.navigate(['/auth']);

    localStorage.removeItem('userData');//очищаємо дані при вилогіненні

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() { //метод, який логінить поточного юзера, який збережений в localStorage, автоматично
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {//перевірка на те, чи у юзера є валідний токен через виклик getter'a
      this.user$.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {//метод, який приймає відповідь з бекенду після REST колу і як side effect створює новий екземпляр класу User, який потім передається в BehaviorSubject
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user$.next(user);

    this.autoLogout(expiresIn * 1000);

    localStorage.setItem('userData', JSON.stringify(user));//зберігаємо дані поточного юзера в localStorage
  }

  private handleError(errorRes: HttpErrorResponse) {//метод де ми централізовано обробляємо помилки чи то при реєстрації чи то при авторизації
    console.log(errorRes);
    let defError = 'An error occured!';
    if (!errorRes.error || !errorRes.error.error) {//додаткова перевірка, у разі якщо повернеться помилка без ключа/вкладеного ключа error, тоді повернемо весь об'єкти помилки
      return throwError(errorRes);
    }
    switch (errorRes.error.error.message) {
      case ('EMAIL_EXISTS'):
        defError = 'This email does not exist';
        break;
      case ('EMAIL_NOT_FOUND'):
        defError = 'This email not found';
        break;
      case ('INVALID_PASSWORD'):
        defError = 'This password is not correct';
        break;
    }
    return throwError(() => new Error(defError));
  }
}
