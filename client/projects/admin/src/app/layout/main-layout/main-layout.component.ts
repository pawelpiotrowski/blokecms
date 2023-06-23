import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AdminAuthUser } from '../../auth/admin-auth.interface';
import { AdminAuthRepository } from '../../auth/admin-auth.repository';
@Component({
  selector: 'admin-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  isLoggedIn = false;
  logoCharacter = '';
  title = '';
  // t, u, T, U are showing tank - removed
  // make love not war
  private readonly characters =
    'abcdefghijklmnopqrsvwxyzABCDEFGHIJKLMNOPQRSVWXYZ';

  constructor(private router: Router, private authRepo: AdminAuthRepository) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(this.routeNavigationEndHandler.bind(this));
    this.authRepo.user$.subscribe(this.setIsLoggedIn.bind(this));
  }

  private setIsLoggedIn(user: AdminAuthUser) {
    this.isLoggedIn = user !== null;
  }

  private generateRandomLetter() {
    return this.characters[Math.floor(Math.random() * this.characters.length)];
  }

  private routeNavigationEndHandler() {
    this.title = this.getActivatedRouteTitle();
    this.setFreshLogoCharacter();
  }

  private getActivatedRouteTitle() {
    let route: ActivatedRoute = this.router.routerState.root;
    let routeTitle = '';
    while (route!.firstChild) {
      route = route.firstChild;
    }
    if (route.snapshot.data['title']) {
      routeTitle = route!.snapshot.data['title'];
    }
    return routeTitle;
  }

  private setFreshLogoCharacter() {
    this.logoCharacter = this.generateRandomLetter();
  }
}
