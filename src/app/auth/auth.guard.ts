import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { map, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot, //currently active route
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user$
      .pipe(
        take(1),//Так як нам не потрібно, щоб наш захист слухав нові дані цього Subject'a постійно, а лише щоб значення user$ бралось лиш раз і все, аж до поки захист не буде викликано повторно
        map(user => {
          const isAuth = !!user; //converting to boolean
          if (isAuth) {
            return isAuth;
          }
          return this.router.createUrlTree(['/auth']);//редіректимось на сторінку авторизації якщо ми не були залогінені попередньо
        }));
  }
}
// Using the UrlTree is only relevant if we have multiple guards applied to the same path.
// In this case, when navigating "manually" by router.navigate() to different urls from inside these guards, it is not clear which guard wins in a specific situation.
// With UrlTree we have a clearly defined hierarchy of guards.