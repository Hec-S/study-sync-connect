import React, { forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { flattenCategories } from "@/lib/categories";

interface CategorySelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
  value?: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export const CategorySelect = forwardRef<HTMLButtonElement, CategorySelectProps>(
  ({ value, onValueChange, error, ...props }, ref) => {
    const categories = flattenCategories();

    return (
      <div className="space-y-1">
        <Select 
          value={value} 
          onValueChange={onValueChange}
          {...props}
        >
          <SelectTrigger ref={ref}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

CategorySelect.displayName = "CategorySelect";
