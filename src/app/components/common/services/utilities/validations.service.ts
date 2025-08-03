import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() { }


  isObjectNullUndefinedOrEmpty(obj: any): boolean {
    return obj === null || obj === undefined || Object.keys(obj).length === 0;
  }

  private getDateFormatOptions(format: string): Intl.DateTimeFormatOptions {
    switch (format) {
      case 'dd MMM yyyy':
        return { day: '2-digit', month: 'short', year: 'numeric' };
      case 'MMM dd, yyyy':
        return { month: 'short', day: '2-digit', year: 'numeric' };
      case 'yyyy-MM-dd':
        return { year: 'numeric', month: '2-digit', day: '2-digit' };
      default:
        return { year: 'numeric', month: 'short', day: '2-digit' };
    }
  }

  // toDateObject(mysqlDateString: string | null | undefined): Date | null {
  //   if (!mysqlDateString) return null;
  //   // Handles '2025-06-17 00:00:00' or '2025-06-17'
  //   const parts = mysqlDateString.split(' ')[0].split('-'); // ['2025','06','17']
  //   if (parts.length !== 3) return null;
  //   const [year, month, day] = parts.map(Number);
  //   // Months in JS Date are 0-based
  //   return new Date(year, month - 1, day);
  // }


    /** ✅ Format Date for UI Display */
    formatDate(date: string | Date, format: string = 'dd MMM yyyy'): string {
      const options: Intl.DateTimeFormatOptions = this.getDateFormatOptions(format);
      const parsedDate = new Date(date);
  
      if (isNaN(parsedDate.getTime())) {
        return ''; 
      }
  
      return parsedDate.toLocaleDateString('en-US', options);
    }


      /**
   * Formats a date input into 'YYYY-MM-DD' string for MySQL.
   * Accepts JS Date, ISO string, or string.
   */
  toMysqlDate(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') {
      // If already in YYYY-MM-DD format, just return first 10 chars
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
      return date.substring(0, 10);
    }
    return date instanceof Date
      ? date.toISOString().substring(0, 10)
      : new Date(date).toISOString().substring(0, 10);
  }

}
