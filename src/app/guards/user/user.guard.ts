import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private app: AppComponent) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.app.checkAuthentication()
    .then((res) => {return this.app.loggedIn ? true : false})
  }

}
