import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { HolidayUtil, Solar } from 'lunar-typescript';

import { parseCalendarDate, shiftCalendarMonth } from '@/lib/calendar';
import { Button } from '@/components/ui/button';

export interface CalendarCardProps {
  value: string;
  today: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export function CalendarCard({
  value,
  today,
  onChange,
  onClose,
}: CalendarCardProps) {
  const selected = parseCalendarDate(value)!;
  const [view, setView] = useState(() => selected);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const shouldFocusDate = useRef(false);
  const first = Solar.fromYmd(view.getYear(), view.getMonth(), 1);
  const start = first.next(-((first.getWeek() + 6) % 7));
  const days = Array.from({ length: 42 }, (_, index) => start.next(index));

  useEffect(() => {
    if (shouldFocusDate.current) {
      gridRef.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${value}"]`)
        ?.focus();
      shouldFocusDate.current = false;
    }
  }, [value, view]);

  const handleSelectDate = (date: Solar) => {
    const next = date.toYmd();
    if (!parseCalendarDate(next)) return;
    onChange(next);
    setDraft(next);
    setError('');
    setView(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="calendar-title" className="font-semibold text-sm">
          选择日期
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="关闭日历"
        >
          <X />
        </Button>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const parsed = parseCalendarDate(draft);
          if (!parsed) {
            setError('请输入有效日期（1900-01-01 至 2100-12-31）。');
            return;
          }
          handleSelectDate(parsed);
        }}
        className="space-y-2"
      >
        <label
          htmlFor="calendar-date"
          className="text-xs text-muted-foreground"
        >
          日期 · 年-月-日
        </label>
        <div className="flex gap-2">
          <input
            id="calendar-date"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'calendar-error' : undefined}
            placeholder="2026-09-07"
            className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm font-mono"
          />
          <Button type="submit" variant="outline">
            跳转
          </Button>
        </div>
        {error && (
          <p
            id="calendar-error"
            role="alert"
            className="text-xs text-destructive"
          >
            {error}
          </p>
        )}
      </form>
      <div className="flex items-center justify-between">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="上个月"
          disabled={view.getYear() === 1900 && view.getMonth() === 1}
          onClick={() => setView(shiftCalendarMonth(view, -1))}
        >
          <ChevronLeft />
        </Button>
        <span className="text-sm font-medium" aria-live="polite">
          {view.getYear()} 年 {view.getMonth()} 月
        </span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="下个月"
          disabled={view.getYear() === 2100 && view.getMonth() === 12}
          onClick={() => setView(shiftCalendarMonth(view, 1))}
        >
          <ChevronRight />
        </Button>
      </div>
      <div>
        <div
          className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-2"
          aria-hidden="true"
        >
          {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div
          ref={gridRef}
          className="grid grid-cols-7 gap-1"
          role="group"
          aria-label="选择日期，方向键移动，PageUp 和 PageDown 切换月份"
        >
          {days.map((date) => {
            const key = date.toYmd();
            const holiday = HolidayUtil.getHoliday(key);
            const isSelected = key === value;
            const isInMonth = date.getMonth() === view.getMonth();
            const isTabStop =
              isSelected ||
              ((selected.getMonth() !== view.getMonth() ||
                selected.getYear() !== view.getYear()) &&
                date.getDay() === 1 &&
                isInMonth);
            return (
              <button
                type="button"
                key={key}
                data-date={key}
                tabIndex={isTabStop ? 0 : -1}
                disabled={!parseCalendarDate(key)}
                aria-pressed={isSelected}
                aria-current={key === today ? 'date' : undefined}
                aria-label={`${key}${key === today ? '，今天' : ''}${holiday ? `，${holiday.getName()}${holiday.isWork() ? '调休上班' : '休息'}` : ''}`}
                onClick={() => handleSelectDate(date)}
                onKeyDown={(event) => {
                  const offsets: Record<string, number> = {
                    ArrowLeft: -1,
                    ArrowRight: 1,
                    ArrowUp: -7,
                    ArrowDown: 7,
                    Home: -((date.getWeek() + 6) % 7),
                    End: 6 - ((date.getWeek() + 6) % 7),
                  };
                  const next =
                    event.key === 'PageUp'
                      ? shiftCalendarMonth(date, -1)
                      : event.key === 'PageDown'
                        ? shiftCalendarMonth(date, 1)
                        : event.key in offsets
                          ? date.next(offsets[event.key])
                          : null;
                  if (next) {
                    event.preventDefault();
                    shouldFocusDate.current = true;
                    handleSelectDate(next);
                  }
                }}
                className={`relative min-h-10 rounded-lg text-sm transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : `${isInMonth ? 'text-foreground' : 'text-muted-foreground/60'} hover:bg-accent ${key === today ? 'ring-1 ring-inset ring-primary' : ''}`}`}
              >
                {date.getDay()}
                {holiday && (
                  <span
                    className={`absolute right-0.5 top-0 text-[9px] ${isSelected ? '' : 'text-muted-foreground'}`}
                  >
                    {holiday.isWork() ? '班' : '休'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between border-t pt-3 gap-2">
        <span className="text-xs text-muted-foreground">
          休：假期 · 班：调休上班
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleSelectDate(parseCalendarDate(today)!)}
        >
          回到今天
        </Button>
      </div>
    </div>
  );
}
