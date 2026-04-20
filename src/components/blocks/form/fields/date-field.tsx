import { useCallback, useMemo } from 'react';

import type { DateRange } from 'react-day-picker';

import type { FieldValue } from '@/components/blocks/form/types';
import { Calendar } from '@/components/ui/calendar';
import { useFieldContext } from '@/components/ui/form';
import { InputButton } from '@/components/ui/input';
import { OverflowText } from '@/components/ui/overflow-text';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { PayloadDateBlock } from '@/payload/payload-types';
import { formatDateShort } from '@/utils/format-date';

type Props = {
  meta: PayloadDateBlock;
};

export function DateField({ meta }: Props) {
  const field = useFieldContext<FieldValue<'date'>>();
  const invalid = !field.state.meta.isValid;

  const value = useMemo<string | null>(() => {
    switch (meta.mode) {
      case 'single': {
        const value = field.state.value as Date | null;

        return formatDateShort(value) || null;
      }
      case 'multiple': {
        const value = field.state.value as Date[] | null;

        return value?.length ? value.map(formatDateShort).join(', ') : null;
      }
      case 'range': {
        const value = field.state.value as { from: Date | null; to?: Date | null } | null;

        if (!value?.from) {
          return null;
        }

        const from = formatDateShort(value.from);

        return value.to ? `${from} – ${formatDateShort(value.to)}` : from;
      }
      default:
        return null;
    }
  }, [meta.mode, field.state.value]);

  const disabled = useCallback(
    (date: Date) => {
      const todaysDate = new Date();

      switch (meta.allowedDates) {
        case 'previous':
          return date > todaysDate;
        case 'future':
          return date < todaysDate;
        default:
          return false;
      }
    },
    [meta.allowedDates],
  );

  const { startMonth, endMonth } = useMemo(() => {
    const now = new Date();
    const tenYearsAgo = new Date(now.getFullYear() - 10, now.getMonth(), 1);
    const tenYearsFromNow = new Date(now.getFullYear() + 10, now.getMonth(), 1);

    switch (meta.allowedDates) {
      case 'previous':
        return { startMonth: tenYearsAgo, endMonth: now };
      case 'future':
        return { startMonth: now, endMonth: tenYearsFromNow };
      default:
        return { startMonth: tenYearsAgo, endMonth: tenYearsFromNow };
    }
  }, [meta.allowedDates]);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <InputButton
            displayChildren={!!value}
            icon={value ? 'calendarCheck' : 'calendar'}
            aria-invalid={invalid || undefined}
          />
        }
      >
        <OverflowText>{value}</OverflowText>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {meta.mode === 'single' ? (
          <Calendar
            mode="single"
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            selected={field.state.value as Date | undefined}
            onSelect={(date) => field.handleChange(date as FieldValue<'date'>)}
            disabled={disabled}
            numberOfMonths={1}
          />
        ) : null}
        {meta.mode === 'multiple' ? (
          <Calendar
            mode="multiple"
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            selected={field.state.value as Date[] | undefined}
            onSelect={(dates) => field.handleChange(dates as FieldValue<'date'>)}
            disabled={disabled}
            numberOfMonths={1}
          />
        ) : null}
        {meta.mode === 'range' ? (
          <Calendar
            mode="range"
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            selected={field.state.value as DateRange | undefined}
            onSelect={(range) => field.handleChange(range as FieldValue<'date'>)}
            disabled={disabled}
            numberOfMonths={1}
          />
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
