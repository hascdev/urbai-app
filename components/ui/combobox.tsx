"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"

export interface FilterOption {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: FilterOption[];
    onSelectOption: (value: string) => void;
    defaultValue?: string;
    value?: string;
}

export function Combobox({ options, onSelectOption, defaultValue = "", value: externalValue }: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(externalValue || defaultValue)

    // Sincronizar estado interno con valor externo
    React.useEffect(() => {
        if (externalValue !== undefined) {
            setValue(externalValue)
        }
    }, [externalValue])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-gray-50 border-gray-200 text-gray-900 font-normal"
                >
                    {value
                        ? options.find((option) => option.value.toString() === value.toString())?.label
                        : "Seleccionar..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-gray-50 border-gray-200 text-gray-900 w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
                <Command>
                    <CommandInput placeholder="Buscar..." />
                    <CommandList>
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    className="text-gray-900 font-normal"
                                    onSelect={() => {
                                        // Usar directamente el option.value (ID) para el estado
                                        const optionValue = option.value.toString();
                                        const newValue = optionValue === value.toString() ? "" : optionValue;
                                        setValue(newValue);
                                        onSelectOption(newValue);
                                        setOpen(false)
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value.toString() === option.value.toString() ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}