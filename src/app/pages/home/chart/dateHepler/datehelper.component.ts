import { formatDate } from '@angular/common';

export class DateHelper {
    getCurrentDate(): string {
        return formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    }

    getStartDate(days: number): string {
        const currentDate = new Date();
        const startDate = new Date(currentDate.setDate(currentDate.getDate() + days));
        return formatDate(startDate, 'yyyy-MM-dd', 'en-US');
    }

    getQuarterStartDate(): string {
        const currentMonth = new Date().getMonth();
        const startMonth = Math.floor(currentMonth / 3) * 3; // Tính tháng đầu của quý
        const startDate = new Date(new Date().setMonth(startMonth, 1));
        return formatDate(startDate, 'yyyy-MM-dd', 'en-US');
    }

    getYearStartDate(): string {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1); // Tháng 0 là tháng 1
        return formatDate(startDate, 'yyyy-MM-dd', 'en-US');
    }
}
