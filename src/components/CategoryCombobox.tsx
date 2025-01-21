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
import { categories } from "@/lib/categories";
import { ScrollArea } from "./ui/scroll-area";

interface CategoryComboboxProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function CategoryCombobox({ value, onChange }: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [customCategory, setCustomCategory] = React.useState("");

  const handleSelect = (currentValue: string) => {
    const newValue = value.includes(currentValue)
      ? value.filter((v) => v !== currentValue)
      : [...value, currentValue];
    onChange(newValue);
  };

  const handleRemove = (categoryToRemove: string) => {
    onChange(value.filter((v) => v !== categoryToRemove));
  };

  const handleCustomCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customCategory.trim()) {
      onChange([...value, `custom-${customCategory.trim()}`]);
      setCustomCategory("");
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[2.5rem] px-3 py-2"
          >
            {value.length === 0 ? (
              <span className="text-muted-foreground">Select categories...</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {value.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="mr-1 mb-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(category);
                    }}
                  >
                    {category.startsWith("custom-")
                      ? category.replace("custom-", "")
                      : categories.find((c) => c.id === category)?.name ||
                        category}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No category found.</CommandEmpty>
            <ScrollArea className="h-64">
              {categories.map((category) => (
                <CommandGroup key={category.id} heading={category.name}>
                  <CommandItem
                    value={category.id}
                    onSelect={() => handleSelect(category.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(category.id)
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
                          value.includes(`${category.id}-${sub.id}`)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {sub.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
              <CommandGroup heading="Custom Category">
                <div className="p-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    onKeyDown={handleCustomCategory}
                    placeholder="Type and press Enter..."
                    className="w-full p-2 text-sm border rounded"
                  />
                </div>
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
      {value.length === 0 && (
        <p className="text-sm text-destructive">
          Please select at least one category
        </p>
      )}
    </div>
  );
}