import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CalendarDays, ChevronDown, Coffee } from 'lucide-react';
import { Solar } from 'lunar-typescript';

import { getHolidayCountdowns } from '@/lib/calendar';
import { CalendarCard } from './CalendarCard';

export interface CalendarSearchPanelProps {
  children: ReactNode;
}

const getToday = () => Solar.fromDate(new Date()).toYmd();

export function CalendarSearchPanel({ children }: CalendarSearchPanelProps) {
  const [todayKey, setTodayKey] = useState(getToday);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    const refreshDate = () => setTodayKey(getToday());
    const timer = window.setInterval(refreshDate, 60_000);
    document.addEventListener('visibilitychange', refreshDate);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refreshDate);
    };
  }, []);

  const [year, month, day] = todayKey.split('-').map(Number);
  const today = Solar.fromYmd(year, month, day);
  const lunar = today.getLunar();
  const holidays = getHolidayCountdowns(today);
  const isWeekend = today.getWeek() === 0 || today.getWeek() === 6;
  const daysUntilSaturday = (6 - today.getWeek() + 7) % 7;

  return (
    <div className="calendar-search-panel mt-7">
      <div className="flex flex-col md:flex-row">
        <button
          type="button"
          className="today-card group"
          aria-label={
            isCalendarOpen ? '收起日历与假期详情' : '展开日历与假期详情'
          }
          aria-expanded={isCalendarOpen}
          aria-controls="workbench-calendar"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          <span className="flex items-center justify-between gap-3 md:w-full">
            <span className="font-mono text-[11px] tracking-wider text-muted-foreground">
              {year} / {String(month).padStart(2, '0')}
            </span>
            <CalendarDays className="hidden md:block h-3.5 w-3.5 text-primary/70" />
          </span>
          <span className="flex items-center gap-3 md:mt-2">
            <span className="font-mono text-[36px] md:text-[48px] leading-none tracking-[-0.06em] text-primary">
              {String(day).padStart(2, '0')}
            </span>
            <span className="flex flex-col gap-1 text-left">
              <span className="text-xs font-medium">
                星期{today.getWeekInChinese()}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {lunar.getMonthInChinese()}月{lunar.getDayInChinese()}
              </span>
            </span>
          </span>
          <span className="flex items-center gap-1 md:mt-3 text-[10px] text-muted-foreground group-hover:text-primary">
            <span className="hidden md:inline">
              {isCalendarOpen ? '收起日历' : '展开日历'}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`}
            />
          </span>
        </button>
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          {children}
          <div className="holiday-strip" aria-label="假期倒计时">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
              <Coffee className="h-3.5 w-3.5 shrink-0" />
              {isWeekend ? (
                '周末愉快'
              ) : (
                <>
                  距周六{' '}
                  <strong className="font-mono font-medium text-foreground">
                    {daysUntilSaturday}
                  </strong>{' '}
                  天
                </>
              )}
            </span>
            {holidays.map((holiday) => (
              <span key={holiday.start} className="holiday-countdown">
                <span>{holiday.name}</span>
                {holiday.daysUntil === 0 ? (
                  <strong className="font-medium text-primary">假期中</strong>
                ) : (
                  <span>
                    <strong className="font-mono font-medium text-primary">
                      {holiday.daysUntil}
                    </strong>
                    <span className="ml-1 text-muted-foreground">天后</span>
                  </span>
                )}
              </span>
            ))}
            {holidays.length === 0 && (
              <span className="text-xs text-muted-foreground">
                暂无后续假期安排
              </span>
            )}
          </div>
        </div>
      </div>
      {isCalendarOpen && (
        <div id="workbench-calendar" className="border-t p-5 sm:p-6">
          <div className="max-w-md mx-auto">
            <CalendarCard key={todayKey} />
          </div>
        </div>
      )}
    </div>
  );
}
