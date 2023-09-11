import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import swal, { SweetAlertResult } from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private translate: TranslateService
  ) { }

  /*** Toast Messages ***/
  toast(type: any, title: string): void {
    const toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      showCloseButton: true,
      animation: false,
      timer: 5000
    });
    toast.fire({ icon: type, title: `${this.translate.instant(title)}` });
  }

  /*** Alert Messages ***/
  alert(type: any, title: string, text?: string): void {
    swal.fire({
      icon: type,
      title: `${this.translate.instant(title)}`,
      text: text ? `${this.translate.instant(text)}` : '',
      confirmButtonText: 'OK'
    });
  }

  /*** confirmation dialog box (returns a promise) ***/
  async confirm(title: string, customClass?: string, text?: string, removeHeader?: boolean): Promise<SweetAlertResult> {
    const result: SweetAlertResult = await swal.fire({
      title: removeHeader ? `${title}?` : `${this.translate.instant('Are you sure you want to')} ${this.translate.instant(title)}?`,
      text,
      customClass: { container: customClass },
      imageUrl: '/assets/images/cancel-icon.svg',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('Confirm'),
      cancelButtonText: removeHeader ? this.translate.instant('Cancel') : this.translate.instant('Cancel'),
      animation: false,
      allowOutsideClick: false,
      allowEscapeKey: true,
    });
    return result;
  }


  /*** Alert Messages ***/
  async preDeliveryBox(): Promise<SweetAlertResult> {
    const result: SweetAlertResult = await swal.fire({
      title: `${this.translate.instant('Select delivery type to send documents')}`,
      showCancelButton: true,
      cancelButtonText: this.translate.instant('Pre Delivery'),
      confirmButtonText: this.translate.instant('Post Delivery')
    });
    return result;
  }
}
