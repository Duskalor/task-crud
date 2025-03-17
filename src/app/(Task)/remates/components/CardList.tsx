'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Remate } from './Remates.types';

import { SelectLocations } from './select-ubications';
import { useState } from 'react';
import { ButtonExternal } from './button-external';

type Props = {
  remates: Remate[];
};

type Currency = 'USD' | 'PEN';
const monedas = {
  USD: '$',
  PEN: 'S/.',
};

export function CardList({ remates: data }: Props) {
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
      <div className='flex gap-10'>
        <Input
          placeholder='Filters...'
          className='max-w-sm'
          value={filtered}
          onChange={(e) => setFiltered(e.target.value)}
        />

        <div className='flex flex-col space-y-1.5'>
          <SelectLocations
            locations={locations}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </div>
      </div>
      <div className='mt-5 font-bold'>
        Cantidad de resultados: {filteredRematesByLocation.length}
      </div>

      <div className='mt-5 grid grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-4'>
        {filteredRematesByLocation.length > 0 ? (
          filteredRematesByLocation.map((remate) => {
            return (
              <Card
                key={remate.id}
                className='w-[350px] bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'
              >
                <CardHeader className='p-4 border-b border-gray-200'>
                  <CardTitle className='text-lg font-bold text-gray-900 text-center'>
                    {remate.title}
                  </CardTitle>
                  <CardDescription className='text-sm text-gray-500 mt-1 text-center'>
                    {remate.type}
                  </CardDescription>
                </CardHeader>

                {/* Contenido */}
                <CardContent className='p-4 space-y-3'>
                  {/* Descripción */}
                  <p className='text-sm text-gray-700 line-clamp-4 '>
                    {remate.description}
                  </p>

                  <div className='flex justify-between z'>
                    {/* Ubicación */}

                    <div>
                      <p className='text-xs font-semibold text-gray-600 uppercase'>
                        Ubicación
                      </p>
                      <p className='text-sm text-gray-800'>{remate.location}</p>
                    </div>
                    {/* Precio */}
                    <div>
                      <p className='text-xs font-semibold text-gray-600 uppercase'>
                        Precio
                      </p>
                      <p className='text-base font-bold text-green-600'>
                        {monedas[remate.price.currency as Currency]}{' '}
                        {remate.price.amount}
                      </p>
                    </div>
                  </div>

                  {/* Fecha de Oferta */}
                  <div>
                    <p className='text-xs font-semibold text-gray-600 uppercase'>
                      Fecha de Oferta
                    </p>
                    <p className='text-sm text-gray-800'>
                      {remate['Offer Date'].date} a las{' '}
                      {remate['Offer Date'].hour}
                    </p>
                  </div>

                  {/* Estado */}
                  <div className='flex justify-between'>
                    <div>
                      <p className='text-xs font-semibold text-gray-600 uppercase'>
                        Estado
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          remate.process === 'Finalizado'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {remate.process}
                      </p>
                    </div>
                    <ButtonExternal text={remate.title} />
                  </div>
                </CardContent>
              </Card>
            );
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
