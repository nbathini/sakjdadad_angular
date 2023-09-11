import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberFormat'
})
export class PhoneNumberFormatPipe implements PipeTransform {
  transform(value: string): string { 
    if (!value) {
      return ''; // Return an empty string for undefined or falsy values
    }
    const digits = value.replace(/\D/g, ''); // Remove non-digits
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)})${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
}
