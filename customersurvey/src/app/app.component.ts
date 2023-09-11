import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LanguageService } from './services/language/language.service';
import { LoaderService } from './services/loader/loader.service';
import { UserService } from './services/user/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  show = false;
  loaderSubscription: Subscription; 
  currentLang = '';
  constructor(
    private loaderService: LoaderService, 
    private ref: ChangeDetectorRef, 
  ) { 
  }

  ngOnInit(): void {   
   
    this.loaderSubscription = this.loaderService.loaderState
      .subscribe((state) => {
        this.show = state.show;
        this.ref.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.show = false;
    this.loaderSubscription.unsubscribe(); 
  }

}
