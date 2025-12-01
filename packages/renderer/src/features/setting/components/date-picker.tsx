import { useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { formatDateToYMD } from "@/lib/date-format";

type DatePickerProps = {
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export default function DatePicker({
  id,
  value,
  placeholder,
  onChange,
}: DatePickerProps) {
  // カレンダーの表示
  const [open, setOpen] = useState(false);
  // カレンダーの選択日
  const date = new Date(value);
  // カレンダーの選択月
  const [month, setMonth] = useState<Date | undefined>(date);

  return (
    <>
      <div className="relative flex gap-2">
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          className="bg-background pr-10"
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={`${id}-date-picker`}
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2 cursor-pointer"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">日付選択</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                if (!date) return;
                const formattedDate = formatDateToYMD(date);
                onChange(formattedDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
