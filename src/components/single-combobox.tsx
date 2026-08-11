"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

export interface ComboboxData {
  value: string;
  label: string;
}

interface ComboboxProps {
  data: ComboboxData[];
  value: string | null;
  onChange: (this: void, value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export default function SingleCombobox({
  data,
  value,
  onChange,
  placeholder = "Pilih data",
  searchPlaceholder = "Cari data...",
  emptyMessage = "Data tidak ditemukan.",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedData = data.find((item) => item.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full cursor-pointer justify-between border-black/20"
        >
          <span
            className={cn("truncate font-normal", !selectedData && "text-muted-foreground font-normal")}
          >
            {selectedData?.label ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 font-[poppins]">
        <Command className="w-full">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="w-full">
            <CommandEmpty className="text-muted-foreground">{emptyMessage}</CommandEmpty>
            <CommandGroup className="w-full">
              {data.map((item) => (
                <div
                  key={item.value}
                  onClick={() => {
                    onChange(
                      item.value === value ? null : item.value,
                    );
                    setOpen(false);
                  }}
                  className="
                    flex items-center justify-between
                    w-full cursor-pointer
                    hover:bg-gray-100
                    rounded-md
                  "
                >
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    className="cursor-pointer w-full bg-transparent!"
                  >
                    <span className="truncate">
                      {item.label}
                    </span>
                  </CommandItem>
                  <Check
                    className={cn(
                      "me-2 h-4 w-4 shrink-0",
                      value === item.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
