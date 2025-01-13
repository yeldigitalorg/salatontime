import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-next-salat-time',
  templateUrl: './next-salat-time.component.html',
  styleUrls: ['./next-salat-time.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
})
export class NextSalatTimeComponent implements OnInit {
  nextPrayerTime: { key: string; value: string } | null = null;
  dailyTimings: { key: string; value: string }[] = [];
  prayersToShow = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  useAmPmFormat: boolean = true; // Default to am/pm format
  location: string = 'Brussels, Belgium';
  todayDate: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.todayDate = this.formatDate(new Date());
    this.fetchTimings();
  }

  private fetchTimings(isTomorrow: boolean = false) {
    const date = new Date();
    if (isTomorrow) date.setDate(date.getDate() + 1);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const apiUrl = `http://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Brussels&country=BE&method=2`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        const timings = response.data.timings;
        this.processTimings(timings, isTomorrow);
      },
      (error) => {
        console.error('Error fetching prayer times:', error);
      }
    );
  }

  private processTimings(timings: { [key: string]: string }, isTomorrow: boolean = false) {
    this.dailyTimings = this.prayersToShow.map((key) => ({
      key,
      value: this.formatTime(timings[key]),
    }));

    if (!isTomorrow) {
      this.nextPrayerTime = this.getNextPrayerTime(timings);
      if (!this.nextPrayerTime) this.fetchTimings(true); // Fetch tomorrow's times if past Isha
    } else {
      this.nextPrayerTime = { key: 'Fajr', value: this.dailyTimings[0].value }; // Tomorrow's Fajr
    }
  }

  private getNextPrayerTime(timings: { [key: string]: string }): { key: string; value: string } | null {
    const now = new Date();
    let nextPrayer: { key: string; value: string } | null = null;

    for (const key of this.prayersToShow) {
      const [hour, minute] = timings[key].split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hour, minute, 0, 0);

      if (prayerTime > now) {
        nextPrayer = { key, value: this.formatTime(timings[key]) };
        break;
      }
    }

    return nextPrayer;
  }

  toggleTimeFormat() {
    this.useAmPmFormat = !this.useAmPmFormat;
    this.dailyTimings = this.dailyTimings.map((timing) => ({
      key: timing.key,
      value: this.formatTime(timing.value, true),
    }));

    if (this.nextPrayerTime) {
      this.nextPrayerTime.value = this.formatTime(this.nextPrayerTime.value, true);
    }
  }

  private formatTime(time: string, forceReformat = false): string {
    const [hour, minute] = time.split(':').map(Number);

    if (this.useAmPmFormat || forceReformat) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
    }

    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
