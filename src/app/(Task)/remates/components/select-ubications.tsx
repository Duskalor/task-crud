'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Props {
  locations: string[];
  selectedLocation: string;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
}

export function SelectLocations({
  selectedLocation,
  setSelectedLocation,
  locations,
}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {selectedLocation
            ? locations.find((framework) => framework === selectedLocation)
            : 'Select Location...'}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search location...' />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location}
                  value={location}
                  onSelect={(currentValue) => {
                    setSelectedLocation(
                      currentValue === selectedLocation ? '' : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {location}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedLocation === location
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
