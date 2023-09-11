import { Component, HostListener, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { logoUrl } from 'src/app/core/app-conf';
import { LanguageService } from 'src/app/services/language/language.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isEnglish: boolean = !!(localStorage.getItem('lang') && localStorage.getItem('lang') === 'en');
  routeSubscription: Subscription;
  firstName = '';
  isLoggedIn = false;
  dropdowns = false;
  screenType = '';
  logoUrl = logoUrl;
  @HostListener('document:click', ['$event'])
  onClick(): void {
    this.dropdowns = false;
  }
  constructor(
    private languageService: LanguageService,
    private router: Router,
    private user: UserService
  ) {
    /*** Check for user token ***/
    this.isLoggedIn = this.user.getUserToken ? true : false;
    this.firstName = this.user.currentUserValue && this.user.currentUserValue.firstName ? this.user.currentUserValue.firstName : '';
  }

  ngOnInit(): void {
    if (this.router.url.includes('survey')) {
      this.screenType = 'survey';
    } else if (this.router.url.includes('delivery')) {
      this.screenType = 'delivery';
    }
    this.routeSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('survey')) {
          this.screenType = 'survey';
        } else if (event.url.includes('delivery')) {
          this.screenType = 'delivery';
        } else {
          this.screenType = '';
        }
      }
    });
  }

  /*** Logout User ***/
  logOut(): void {
    this.user.userSignOut();
  }

  clickEvent(): void {
    this.isEnglish = !this.isEnglish;
    if (this.isEnglish) {
      this.languageService.setLanguage('en');
    } else {
      this.languageService.setLanguage('fr');

    }
  }
  /*** Toggle dropdown ***/
  dropdown(): void {
    this.dropdowns = !this.dropdowns;
  }
}
