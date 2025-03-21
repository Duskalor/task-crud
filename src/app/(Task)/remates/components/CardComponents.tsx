import React from 'react';
import { type Prices, type Remate } from './Remates.types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ButtonExternal } from './button-external';

type Currency = 'USD' | 'PEN';

const monedas = {
  USD: '$',
  PEN: 'S/.',
};

export const CardComponents = ({ remate }: { remate: Remate }) => {
  const currency = remate.price.currency;

  return (
    <Card className='w-[350px] bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
      <CardHeader className='p-4 border-b border-gray-200'>
        <CardTitle className='text-lg font-bold text-gray-900 text-center'>
          {remate.title}
        </CardTitle>
        <CardDescription className='text-sm text-gray-500 mt-1 text-center'>
          {remate.type}
        </CardDescription>
      </CardHeader>
      <CardContent className='p-4  h-[310px] flex flex-col justify-between'>
        <p className='text-sm text-gray-700 line-clamp-4 '>
          {remate.description}
        </p>
        <section className='space-y-3'>
          <div>
            <p className='text-xs font-semibold text-gray-600 uppercase'>
              Ubicación
            </p>
            <p className='text-sm text-gray-800'>{remate.location}</p>
          </div>

          <div className='flex justify-between z'>
            <div>
              <p className='text-xs font-semibold text-gray-600 uppercase'>
                Precio
              </p>
              <p className='text-base font-bold text-green-600'>
                {monedas[currency as Currency]}&nbsp;
                {remate.price.amount}
              </p>
            </div>
            <div>
              <p className='text-xs font-semibold text-gray-600 uppercase'>
                convertido
              </p>
              <p className='text-base font-bold text-green-600'>
                {/* {currency === 'USD' ? 'S/.' : '$'}&nbsp; */}
                {remate.price.converted}
              </p>
            </div>
          </div>

          <div>
            <p className='text-xs font-semibold text-gray-600 uppercase'>
              Fecha de Oferta
            </p>
            <p className='text-sm text-gray-800'>
              {remate['Offer Date'].date} a las {remate['Offer Date'].hour}
            </p>
          </div>

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
        </section>
      </CardContent>
    </Card>
  );
};
