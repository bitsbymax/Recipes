import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user$.pipe(
      take(1),//дає можливість отримати по підписці дані вказану кількість разів і після автоматично відписатись
      exhaustMap(user => {//чекає поки завершиться перший Observable (user$), отримує як параметр його дані і замінює його в ланцюгу Observables на внутрішній, тобто той, що буде повернуто викликом next.handle(req).
        if (!user) { //так як ми викор. цей інтерсептор для всіх вихідних запитів, необхідна перевірка наявності об'єкта User, бо при запиті на завантаження рецептів user == null (по дефолту)
          return next.handle(req);
        }
        const modifiedReq = req.clone(
          {
            params: new HttpParams().set('auth', user.token) //передаємо токен, для того, щоб сервер розумів, який юзер зараз залогінений
          }
        );
        return next.handle(modifiedReq);
      })
    );
  }
}
