import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { CalendarDate } from 'src/app/shared/models/calendar.model';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {
  currentDate = moment();
  nextMonthDate = moment();
  namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  selectedDate: moment.Moment | null;
  currentMonthWeeks: Array<CalendarDate[]> = [];
  nextMonthWeeks: Array<CalendarDate[]> = [];
  @Output() dateSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    const currentDate = this.currentDate.clone();
    this.nextMonthDate = moment(currentDate).add(1, 'months');
    this.generateCalendar();
  }

  private generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const dates2 = this.fillDates(this.nextMonthDate);
    const currentMonthWeeks = [];
    const nextMonthWeeks = [];
    while (dates.length > 0) {
      currentMonthWeeks.push(dates.splice(0, 7));
    }
    while (dates2.length > 0) {
      nextMonthWeeks.push(dates2.splice(0, 7));
    }
    this.currentMonthWeeks = currentMonthWeeks;
    this.nextMonthWeeks = nextMonthWeeks;
    this.dateSelect.emit(this.selectedDate);
  }


  fillDates(currentMoment: moment.Moment): Array<any> {
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const lastOfMonth = moment(currentMoment).endOf('month').day();

    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const lastDayOfGrid = moment(currentMoment).endOf('month').subtract(lastOfMonth, 'days').add(7, 'days');

    const startCalendar = firstDayOfGrid.date();
    return this.rangeArray(startCalendar, startCalendar + lastDayOfGrid.diff(firstDayOfGrid, 'days') - 1).map((date) => {
      const newDate = moment(firstDayOfGrid).date(date);
      return {
        today: this.isToday(newDate),
        selected: this.isSelected(newDate),
        mDate: newDate,
      };
    });
  }

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    if (this.selectedDate) { return moment(this.selectedDate).format('DD/MM/YYYY') === moment(date).format('DD/MM/YYYY'); }
    return false;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  isSelectedNextMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.nextMonthDate, 'month');
  }

  selectDate(date: any): void {
    this.selectedDate = moment(date.mDate);
    this.generateCalendar();
  }

  prevMonth(): void {
    this.selectedDate = null;
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.nextMonthDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  nextMonth(): void {
    this.selectedDate = null;
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.nextMonthDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  rangeArray(start: number, end: number): Array<any> {
    const inc = (end - start) / Math.abs(end - start);

    return Array.from(
      Array(Math.abs(end - start) + 1),
      (_, i) => start + i * inc
    );
  }

}
