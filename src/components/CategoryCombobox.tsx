"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories } from "@/lib/categories";

interface CategoryComboboxProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  className?: string;
}

export function CategoryCombobox({
  selectedCategories,
  onCategoriesChange,
  className,
}: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [otherCategory, setOtherCategory] = React.useState("");

  // Flatten categories for the combobox
  const flatCategories = categories.flatMap((category) => [
    { value: category.id, label: category.name },
    ...(category.subcategories?.map((sub) => ({
      value: `${category.id}-${sub.id}`,
      label: `${category.name} - ${sub.name}`,
    })) || []),
  ]);

  // Add "Other" option
  flatCategories.push({ value: "other", label: "Other" });

  const handleSelect = (currentValue: string) => {
    setOpen(false);
    if (currentValue === "other") {
      if (!selectedCategories.includes("other")) {
        onCategoriesChange([...selectedCategories, "other"]);
      }
      return;
    }

    onCategoriesChange(
      selectedCategories.includes(currentValue)
        ? selectedCategories.filter((cat) => cat !== currentValue)
        : [...selectedCategories, currentValue]
    );
  };

  const handleOtherCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherCategory(e.target.value);
    // You can handle the custom category value here
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategories.length === 0
              ? "Select categories..."
              : `${selectedCategories.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No category found.</CommandEmpty>
            {categories.map((category) => (
              <CommandGroup key={category.id} heading={category.name}>
                <CommandItem
                  value={category.id}
                  onSelect={() => handleSelect(category.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategories.includes(category.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {category.name}
                </CommandItem>
                {category.subcategories?.map((sub) => (
                  <CommandItem
                    key={`${category.id}-${sub.id}`}
                    value={`${category.id}-${sub.id}`}
                    onSelect={() => handleSelect(`${category.id}-${sub.id}`)}
                    className="pl-6"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategories.includes(`${category.id}-${sub.id}`)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {sub.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandGroup heading="Other">
              <CommandItem value="other" onSelect={() => handleSelect("other")}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCategories.includes("other")
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                Other
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((categoryId) => {
            const category = flatCategories.find((c) => c.value === categoryId);
            return (
              <Badge
                key={categoryId}
                variant="secondary"
                className="cursor-pointer"
                onClick={() =>
                  onCategoriesChange(
                    selectedCategories.filter((id) => id !== categoryId)
                  )
                }
              >
                {category?.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            );
          })}
        </div>
      )}

      {selectedCategories.includes("other") && (
        <div className="space-y-2">
          <Label htmlFor="otherCategory">Specify your category</Label>
          <Input
            id="otherCategory"
            value={otherCategory}
            onChange={handleOtherCategoryChange}
            placeholder="Enter your custom category"
          />
        </div>
      )}
    </div>
  );
}