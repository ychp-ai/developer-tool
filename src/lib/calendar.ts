import { HolidayUtil, Solar } from 'lunar-typescript';

export interface HolidayCountdown {
  name: string;
  start: string;
  end: string;
  daysUntil: number;
}

export function getHolidayCountdowns(today: Solar): HolidayCountdown[] {
  const holidays = [
    ...HolidayUtil.getHolidays(today.getYear()),
    ...HolidayUtil.getHolidays(today.getYear() + 1),
  ]
    .filter((holiday) => !holiday.isWork())
    .sort((a, b) => a.getDay().localeCompare(b.getDay()));
  const periods: HolidayCountdown[] = [];

  for (const holiday of holidays) {
    const day = holiday.getDay();
    const previous = periods.at(-1);
    if (
      previous?.name === holiday.getName() &&
      Solar.fromYmd(...parseDate(previous.end))
        .next(1)
        .toYmd() === day
    ) {
      previous.end = day;
    } else {
      periods.push({
        name: holiday.getName(),
        start: day,
        end: day,
        daysUntil: Math.max(
          0,
          Solar.fromYmd(...parseDate(day)).subtract(today),
        ),
      });
    }
  }

  return periods.filter((period) => period.end >= today.toYmd()).slice(0, 2);
}

function parseDate(value: string): [number, number, number] {
  const [year, month, day] = value.split('-').map(Number);
  return [year, month, day];
}
