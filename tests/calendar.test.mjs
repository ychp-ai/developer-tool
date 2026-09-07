import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Solar } from 'lunar-typescript';
import { getHolidayCountdowns } from '../src/lib/calendar.ts';

test('countdowns use calendar days and skip workday adjustments', () => {
  const countdowns = getHolidayCountdowns(Solar.fromYmd(2026, 9, 7));
  assert.deepEqual(
    countdowns.map(({ name, daysUntil }) => ({ name, daysUntil })),
    [
      { name: '中秋节', daysUntil: 18 },
      { name: '国庆节', daysUntil: 24 },
    ],
  );
});

test('a holiday remains visible throughout the break and disappears after its last day', () => {
  for (const day of [25, 26, 27]) {
    const [holiday] = getHolidayCountdowns(Solar.fromYmd(2026, 9, day));
    assert.equal(holiday.name, '中秋节');
    assert.equal(holiday.daysUntil, 0);
  }
  assert.equal(
    getHolidayCountdowns(Solar.fromYmd(2026, 9, 28))[0].name,
    '国庆节',
  );
});

test('countdowns include the following year without inventing missing holiday data', () => {
  const [holiday] = getHolidayCountdowns(Solar.fromYmd(2025, 12, 31));
  assert.equal(holiday.name, '元旦节');
  assert.equal(holiday.daysUntil, 1);
  assert.deepEqual(getHolidayCountdowns(Solar.fromYmd(2099, 12, 31)), []);
});

test('date input rejects empty, malformed and impossible dates', async () => {
  const { parseCalendarDate, shiftCalendarMonth } =
    await import('../src/lib/calendar.ts');
  for (const value of [
    '',
    'NaN-09-07',
    '2026-02-31',
    '2025-02-29',
    '2026-13-01',
    '1899-12-31',
    '2101-01-01',
  ]) {
    assert.equal(parseCalendarDate(value), null, value);
  }
  assert.equal(parseCalendarDate('2024-02-29').toYmd(), '2024-02-29');
  assert.equal(
    shiftCalendarMonth(parseCalendarDate('2026-01-31'), 1).toYmd(),
    '2026-02-28',
  );
  assert.equal(
    shiftCalendarMonth(parseCalendarDate('2026-12-31'), 1).toYmd(),
    '2027-01-31',
  );
});
