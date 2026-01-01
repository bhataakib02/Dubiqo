import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
  value?: string; // ISO string format
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fromDate?: Date;
  toDate?: Date;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date and time",
  disabled = false,
  className,
  fromDate,
  toDate,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  
  // Parse ISO string to Date object
  const dateTimeValue = value ? new Date(value) : undefined;
  const dateValue = dateTimeValue ? new Date(dateTimeValue.getFullYear(), dateTimeValue.getMonth(), dateTimeValue.getDate()) : undefined;
  const timeValue = dateTimeValue ? format(dateTimeValue, 'HH:mm') : '09:00';
  
  const [selectedTime, setSelectedTime] = React.useState(timeValue);
  const [tempDate, setTempDate] = React.useState<Date | undefined>(dateValue);
  const [tempTime, setTempTime] = React.useState(timeValue);
  
  // Update time when value changes
  React.useEffect(() => {
    if (dateTimeValue) {
      setSelectedTime(format(dateTimeValue, 'HH:mm'));
      setTempTime(format(dateTimeValue, 'HH:mm'));
      setTempDate(new Date(dateTimeValue.getFullYear(), dateTimeValue.getMonth(), dateTimeValue.getDate()));
    }
  }, [value]);
  
  // Handle calendar date selection (temporary)
  const handleCalendarSelect = (date: Date | undefined) => {
    setTempDate(date);
  };

  // Handle time change (temporary)
  const handleTimeChangeTemp = (time: string) => {
    setTempTime(time);
  };

  // Confirm and apply the selected date and time
  const handleConfirm = () => {
    if (tempDate) {
      const [hours, minutes] = tempTime.split(':').map(Number);
      const newDateTime = new Date(tempDate);
      newDateTime.setHours(hours, minutes, 0, 0);
      onChange(newDateTime.toISOString());
      setSelectedTime(tempTime);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateTimeValue && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateTimeValue ? (
            <span>{format(dateTimeValue, "PPP 'at' HH:mm")}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 z-[9999]" 
        align="start" 
        sideOffset={5}
        side="bottom"
        style={{ zIndex: 9999 }}
      >
        <div className="p-4 flex gap-4">
          <Calendar
            mode="single"
            selected={tempDate}
            onSelect={handleCalendarSelect}
            initialFocus
            fromDate={fromDate}
            toDate={toDate}
          />
          <div className="border-l pl-4 flex flex-col justify-center space-y-3 w-[200px]">
            <Label className="text-sm font-medium flex items-center gap-2 whitespace-nowrap">
              <Clock className="h-4 w-4 text-primary flex-shrink-0" />
              Time
            </Label>
            <Input
              type="time"
              value={tempTime}
              onChange={(e) => handleTimeChangeTemp(e.target.value)}
              className="w-full h-11 text-base"
              style={{ fontSize: '16px', minWidth: '180px' }}
            />
            <Button
              onClick={handleConfirm}
              className="w-full h-10"
              disabled={!tempDate}
            >
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

