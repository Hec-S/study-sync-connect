import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateOfBirthPickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export const DateOfBirthPicker = ({ value, onChange }: DateOfBirthPickerProps) => {
  return (
    <div className="space-y-2">
      <Label>Date of Birth</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) => {
              const today = new Date();
              const minAge = new Date();
              minAge.setFullYear(today.getFullYear() - 13);
              return date > minAge;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};