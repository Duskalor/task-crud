'use client';

import { Input } from '@/components/ui/input';

import { type Prices, type Remate } from './Remates.types';

import { SelectLocations } from './select-ubications';
import { useState } from 'react';

import { PricesComponent } from './PricesComponent';
import { Car } from 'lucide-react';
import { CardComponents } from './CardComponents';

type Props = {
  remates: Remate[];
  prices: Prices;
};

export function CardList({ remates: data, prices }: Props) {
  const remates = data.reduce((acc, remate) => {
    if (acc.find((r) => r.title === remate.title)) return acc;
    return [...acc, remate];
  }, [] as Remate[]);

  const [filtered, setFiltered] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const locations = [...new Set(remates.map((re) => re.location))].sort();

  const filteredRemates = remates.filter((remate) => {
    const { description, title } = remate;
    const isExist = Object.values({ description, title }).some((val) =>
      val.toLowerCase().includes(filtered.toLowerCase())
    );
    return isExist ? remate : null;
  });

  const filteredRematesByLocation =
    selectedLocation !== ''
      ? filteredRemates.filter((remate) => remate.location === selectedLocation)
      : filteredRemates;

  return (
    <section>
      <div className='flex  md:justify-between gap-5 md:gap-0 flex-col md:flex-row'>
        <div className='flex md:gap-10 gap-5  max-w-2xl w-full flex-col md:flex-row'>
          <Input
            placeholder='Filters...'
            className='max-w-sm'
            value={filtered}
            onChange={(e) => setFiltered(e.target.value)}
          />

          <div className='flex flex-col space-y-1.5 items-center'>
            <SelectLocations
              locations={locations}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
          </div>
        </div>
        <PricesComponent prices={prices} />
      </div>
      <div className='mt-5 font-bold text-center md:text-left'>
        Cantidad de resultados: {filteredRematesByLocation.length}
      </div>

      <div className='mt-10 md:mt-5 grid grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-4'>
        {filteredRematesByLocation.length > 0 ? (
          filteredRematesByLocation.map((remate) => {
            return <CardComponents key={remate.id} remate={remate} />;
          })
        ) : (
          <div className='text-center col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center'>
            <b>remate not found</b>
          </div>
        )}
      </div>
    </section>
  );
}
