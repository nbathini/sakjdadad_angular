import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  languagesSubject = new BehaviorSubject('en');

  constructor(private translate: TranslateService) {
    const currentLanguage = localStorage.getItem('lang') || this.translate.getBrowserLang();
    this.languagesSubject = new BehaviorSubject(currentLanguage);
    this.setLanguage(currentLanguage);
  }
  /*** Set user language local storage ***/
  setLanguage(lang: string): void {
    localStorage.setItem('lang', lang);
    this.languagesSubject.next(lang);
    this.translate.use(lang);
  }

  /*** Set get current language ***/
  getCurrentlanguage(): Observable<any> {
    return this.languagesSubject.asObservable();
  }

}
