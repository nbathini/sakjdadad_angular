import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(data: Array<any>, searchText: string): any {
    if (!data) { return []; }
    if (!searchText) { return data; }
    searchText = searchText.toLowerCase();
    console.log(searchText);
    return data.filter((val: any) => {
      if (val.contactNumber.includes(searchText) ||
        val.customerEmail.toLowerCase().includes(searchText) ||
        val.customerName.toLowerCase().includes(searchText) ||
        val.porschePro.name.toLowerCase().includes(searchText) ||
        val.salesConsultant.name.toLowerCase().includes(searchText) ||
        val.serviceAdvisor.name.toLowerCase().includes(searchText) ||
        val.model.name.toLowerCase().includes(searchText)) { return val; }
    });
  }
}
