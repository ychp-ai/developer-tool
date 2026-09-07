import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { CalendarDays, ChevronDown, Coffee } from 'lucide-react';
import { HolidayUtil, Solar } from 'lunar-typescript';

import { getHolidayCountdowns } from '@/lib/calendar';
import { CalendarCard } from './CalendarCard';

export interface CalendarSearchPanelProps {
  children: ReactNode;
}

const getToday = () => Solar.fromDate(new Date()).toYmd();

export function CalendarSearchPanel({ children }: CalendarSearchPanelProps) {
  const [todayKey, setTodayKey] = useState(getToday);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dateKey = selectedDate ?? todayKey;
  const isToday = dateKey === todayKey;
  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
    triggerRef.current?.focus();
  };
  useEffect(() => {
    if (!isCalendarOpen) return;
    dialogRef.current?.querySelector<HTMLInputElement>('input')?.focus();
    const handleOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !dialogRef.current?.contains(event.target) &&
        !triggerRef.current?.contains(event.target)
      )
        setIsCalendarOpen(false);
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [isCalendarOpen]);

  useEffect(() => {
    const refreshDate = () => setTodayKey(getToday());
    const timer = window.setInterval(refreshDate, 60_000);
    document.addEventListener('visibilitychange', refreshDate);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refreshDate);
    };
  }, []);

  const [year, month, day] = dateKey.split('-').map(Number);
  const today = Solar.fromYmd(year, month, day);
  const lunar = today.getLunar();
  const holidays = useMemo(
    () =>
      getHolidayCountdowns(
        Solar.fromYmd(
          ...(dateKey.split('-').map(Number) as [number, number, number]),
        ),
      ),
    [dateKey],
  );
  const isAdjustedWorkday = HolidayUtil.getHoliday(dateKey)?.isWork();
  const isWeekend = today.getWeek() === 0 || today.getWeek() === 6;
  const daysUntilSaturday = (6 - today.getWeek() + 7) % 7;

  return (
    <div className="calendar-search-panel relative mt-7">
      <div className="flex flex-col md:flex-row">
        <button
          ref={triggerRef}
          type="button"
          className="today-card group"
          aria-label={
            isCalendarOpen ? '收起日历与假期详情' : '展开日历与假期详情'
          }
          aria-haspopup="dialog"
          aria-expanded={isCalendarOpen}
          aria-controls="workbench-calendar"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          <span className="flex items-center justify-between gap-3 md:w-full">
            <span className="font-mono text-xs tracking-wider text-muted-foreground">
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
              <span className="text-xs text-muted-foreground">
                {lunar.getMonthInChinese()}月{lunar.getDayInChinese()}
              </span>
            </span>
          </span>
          <span className="flex items-center gap-1 md:mt-3 text-xs text-muted-foreground group-hover:text-primary">
            <span className="hidden md:inline">
              {isToday ? '今天' : '所选日期'} ·{' '}
              {isCalendarOpen ? '收起' : '日历'}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`}
            />
          </span>
        </button>
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          {children}
          {!isToday && (
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span>按 {dateKey} 计算</span>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="text-primary underline underline-offset-4"
              >
                回到今天
              </button>
            </div>
          )}
          <div className="holiday-strip" aria-label="假期倒计时">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-xs text-muted-foreground">
              <Coffee className="h-3.5 w-3.5 shrink-0" />
              {isAdjustedWorkday ? (
                '调休上班'
              ) : isWeekend ? (
                '周末'
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
        <div
          id="workbench-calendar"
          ref={dialogRef}
          role="dialog"
          aria-labelledby="calendar-title"
          className="fixed bottom-4 left-4 right-4 z-30 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border bg-popover p-4 shadow-xl sm:absolute sm:bottom-auto sm:left-0 sm:right-auto sm:top-full sm:mt-2 sm:max-h-[65dvh] sm:w-[360px]"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              handleCloseCalendar();
            }
            if (event.key === 'Tab') {
              const items = dialogRef.current?.querySelectorAll<HTMLElement>(
                'button:not(:disabled):not([tabindex="-1"]), input',
              );
              if (!items?.length) return;
              const first = items[0];
              const last = items[items.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
              }
            }
          }}
        >
          <CalendarCard
            value={dateKey}
            today={todayKey}
            onChange={(value) =>
              setSelectedDate(value === todayKey ? null : value)
            }
            onClose={handleCloseCalendar}
          />
        </div>
      )}
    </div>
  );
}
