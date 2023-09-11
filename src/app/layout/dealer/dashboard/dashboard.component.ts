import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CalenderComponent } from '../common/calender/calender.component';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http/http.service';
import { ApiUrl } from 'src/app/core/apiUrl';
import { CustomerDelivery } from 'src/app/shared/models/delivery.model';
import { MessageService } from 'src/app/services/message/message.service';
import { NgModel } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  rolePermissions: any;
  constructor(
    private router: Router,
    private message: MessageService,
    private http: HttpService,
    private user : UserService
  ) { }
  status = false;
  @ViewChild(CalenderComponent) calender: CalenderComponent;
  activeTab = 0;
  allDeliveries: Array<CustomerDelivery> = [];

  selectedStartWeek = moment().startOf('isoWeek');
  selectedEndWeek = moment().endOf('isoWeek');
  selectedWeek = '';
  currentDate = moment();
  selectedWeekDate: moment.Moment | null;
  selectedCalendarDate: moment.Moment | null;
  today = moment();
  weekDays: Array<any> = [];
  selectedDayDelivery: Array<CustomerDelivery> = [];
  searchInToday = '';
  searchInWeek = '';
  searchInMonth = '';
  clickEvent(): void {
    this.status = !this.status;
  }

  ngOnInit(): void {
    this.selectDate(this.currentDate);
    this.getUpcomingDeliveries(this.activeTab);
    this.rolePermissions = this.user.getRoleGroup();
  }
  clearValue(): void {
    this.searchInToday = '';
    this.searchInWeek = '';
    this.searchInMonth = '';
  }

  /*** Navigate to Add Delivery ***/
  addDelivery(): void {
    this.router.navigate(['add-delivery']);
  }

  /*** Navigate to Add Delivery ***/
  editDelivery(event: any, id: number): void {
    event.stopPropagation();
    this.router.navigate(['edit-delivery', id]);
  }

  /*** Tabs Switch ***/
  tabChanged(event: any): void {
    this.activeTab = event.index;
    this.status = false;
    this.getUpcomingDeliveries(this.activeTab);
  }

  /*** Get Upcoming Deliveries ***/
  getUpcomingDeliveries(type: number): void {
    this.allDeliveries = [];
    const params = {
      startDate: '',
      endDate: ''
    };

    if (type === 0) {
      params.startDate = this.today.format('YYYY-MM-DD');
      params.endDate = this.today.format('YYYY-MM-DD');
    } else if (type === 1) {
      params.startDate = this.selectedStartWeek.format('YYYY-MM-DD');
      params.endDate = this.selectedEndWeek.format('YYYY-MM-DD');
    } else {
      params.startDate = this.calender.currentDate.startOf('month').format('YYYY-MM-DD');
      params.endDate = this.calender.currentDate.endOf('month').format('YYYY-MM-DD');
    }
    this.http.getData(ApiUrl.dealer.delivery, params).subscribe((response) => {
      if (!!response) {
        const result = response.result ? response.result : [];
        if (result.length) {
          result.map((v: any) => {
            v.modelName = v.model.name.split(' ');
          });
        }
        this.allDeliveries = result;
        this.selectedDayDelivery = result;
        if (type) {
          if (type === 2) {
            if (this.calender.selectedDate) { this.getSelectedDayArray(this.calender.selectedDate); }
          } else {
            if (this.selectedWeekDate) { this.getSelectedDayArray(this.selectedWeekDate); }
          }
        }
      }
    });
  }

  /*** Current Day Count ***/
  getSelectedDayArray(date: moment.Moment): void {
    const deliveriesByDate: any = [];
    this.allDeliveries.forEach((val) => {
      if (moment(val.deliveryDate).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
        deliveriesByDate.push(val);
      }
    });
    this.selectedDayDelivery = deliveriesByDate;
    this.selectedCalendarDate = this.calender && this.calender.selectedDate ? this.calender.selectedDate : null;
  }

  /*** Change Week Range ***/
  changeWeek(type: string): void {
    let currentDate = moment();
    if (type === 'next') {
      currentDate = this.currentDate.add(7, 'd');
    } else {
      currentDate = this.currentDate.subtract(7, 'd');
    }
    this.selectDate(currentDate);
    this.selectedWeekDate = null;
    this.getUpcomingDeliveries(this.activeTab);
  }

  /*** Change Month Range ***/
  changeMonth(type: string): void {
    if (type === 'next') {
      this.calender.nextMonth();
    } else {
      this.calender.prevMonth();
    }
    this.getUpcomingDeliveries(this.activeTab);
  }

  /*** Select Day ***/
  selectWeekDay(date: moment.Moment): void {
    this.selectedWeekDate = date;
    this.selectDate(date);
    this.getSelectedDayArray(date);
  }

  /*** Select Date in Week ***/
  selectDate(date: moment.Moment): void {
    this.currentDate = moment(date);
    this.selectedStartWeek = moment(this.currentDate).startOf('isoWeek');
    this.selectedEndWeek = moment(this.currentDate).endOf('isoWeek');
    this.selectedWeek = `${this.selectedStartWeek.format('DD MMM')} - ${this.selectedEndWeek.format('DD MMM, YYYY')}`;
    this.weekDays = this.generateWeek(this.selectedStartWeek, this.selectedEndWeek);
  }

  /*** Check same day  ***/
  isSelected(date: moment.Moment): boolean {
    if (!!this.selectedWeekDate) { return this.selectedWeekDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD'); }
    return false;
  }

  /*** Generate Weekdays  ***/
  generateWeek(startDate: moment.Moment, endDate: moment.Moment): Array<any> {
    const dates = [];

    const currDate = moment(startDate).subtract(1, 'days');

    while (currDate.add(1, 'days').diff(endDate) < 0) {
      dates.push({
        selected: this.isSelected(currDate),
        mDate: currDate.clone(),
      });
    }

    return dates;

  }

  /*** Remove Delivery ***/
  removeDelivery(event: any, id: number): void {
    event.stopPropagation();

    this.message.confirm('delete this delivery', 'remove-delivery').then(data => {
      if (data.value) {
        this.http.deleteData(ApiUrl.dealer.delivery, id.toString()).subscribe((response) => {
          if (!!response) {
            this.message.toast('success', response.message);
            this.getUpcomingDeliveries(this.activeTab);
          }
        });
      }
    });
  }
}
