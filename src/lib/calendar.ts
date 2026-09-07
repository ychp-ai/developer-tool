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

/** Validate before constructing Solar: the library accepts invalid dates. */
export function parseCalendarDate(value: string): Solar | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = parseDate(value);
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1)
    return null;
  const daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth ? Solar.fromYmd(year, month, day) : null;
}

export function shiftCalendarMonth(date: Solar, offset: number): Solar {
  const next = new Date(date.getYear(), date.getMonth() - 1 + offset, 1);
  const day = Math.min(
    date.getDay(),
    new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate(),
  );
  return Solar.fromYmd(next.getFullYear(), next.getMonth() + 1, day);
}
