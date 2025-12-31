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
  
  // Update time when value changes
  React.useEffect(() => {
    if (dateTimeValue) {
      setSelectedTime(format(dateTimeValue, 'HH:mm'));
    }
  }, [value]);
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Combine selected date with current time
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const newDateTime = new Date(date);
      newDateTime.setHours(hours, minutes, 0, 0);
      onChange(newDateTime.toISOString());
    }
  };
  
  // Handle time change
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (dateValue) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDateTime = new Date(dateValue);
      newDateTime.setHours(hours, minutes, 0, 0);
      onChange(newDateTime.toISOString());
    }
  };
  
  // Handle calendar date selection
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const newDateTime = new Date(date);
      newDateTime.setHours(hours, minutes, 0, 0);
      onChange(newDateTime.toISOString());
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
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleCalendarSelect}
            initialFocus
            fromDate={fromDate}
            toDate={toDate}
          />
          <div className="border-t pt-3 space-y-2">
            <Label className="text-sm font-medium">Time</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-32"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

