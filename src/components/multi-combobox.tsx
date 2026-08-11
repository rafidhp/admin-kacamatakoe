import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MultiComboboxProps {
  placeholder: string;
  emptyMessage: string;
  options: [string, string][];
  value: string[];
  onChange(this: void, value: string[]): void;
}

export default function MultiCombobox({
  placeholder,
  emptyMessage,
  options,
  value,
  onChange,
}: MultiComboboxProps) {
  const [open, setOpen] = useState(false);
  const selectedText = () => {
    if (value.length === 0) {
      return placeholder;
    }

    const labels = options
      .filter(([key]) => value.includes(key))
      .map(([, label]) => label);

    if (labels.length <= 2) {
      return labels.join(", ");
    }

    return `${labels.slice(0, 2).join(", ")} +${labels.length - 2}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          className="w-full cursor-pointer justify-between"
        >
          <span className="truncate">{selectedText()}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map(([key, label]) => (
                <CommandItem
                  key={key}
                  value={label}
                  onSelect={() => {
                    if (value.includes(key)) {
                      onChange(value.filter((item) => item !== key));
                    } else {
                      onChange([...value, key]);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Checkbox
                    checked={value.includes(key)}
                    className="mr-2 border border-white data-[state=checked]:fill-black data-[state=checked]:text-black"
                  />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
