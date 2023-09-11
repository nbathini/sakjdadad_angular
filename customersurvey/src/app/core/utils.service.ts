import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  formatPhoneNumber(valueInput: any): any {
    const value = valueInput;
  
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
  
    // Check if the value is not empty
    if (digits.length > 0) {
      // Apply the desired format
      const formattedValue =
        '(' +
        digits.slice(0, 3) +
        ')' +
        digits.slice(3, 6) +
        '-' +
        digits.slice(6);
  
      return formattedValue;
    } else {
      return '';
    }
  }
  usCanadaPhoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const phoneNumber = control.value;

    // Regular expression for matching US and Canada phone numbers
    const phoneNumberPattern = /^\+1 \(\d{3}\)\d{3}-\d{4}$/;

    if (!phoneNumberPattern.test(phoneNumber)) {
      return { invalidPhoneNumber: true };
    }

    return null;
  }
}
