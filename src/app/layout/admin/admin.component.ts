import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  documentScreen = false;
  routeSubscription: Subscription;

  constructor(
    private router: Router,
    private user: UserService
  ) { }

  ngOnInit(): void {
    this.documentScreen = this.router.url.includes('manage-documents');
    this.routeSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('manage-documents')) {
          this.documentScreen = true;
        } else {
          this.documentScreen = false;
        }
      }
    });
  }

  /*** Logout User ***/
  logOut(): void {
    this.user.adminSignOut();
  }
}
