import React from 'react';

interface PricesComponentProps {
  prices: {
    compra: number | string;
    venta: number | string;
  };
}

export const PricesComponent = ({ prices }: PricesComponentProps) => {
  const { compra, venta } = prices;

  return (
    <div className='flex  items-center justify-center md:justify-between text-gray-800  rounded-xl md:mr-8'>
      <span className='text-green-600 font-semibold text-sm'>
        Compra: {compra}
      </span>
      <span className='mx-2 text-gray-500 text-sm md:text-base'>|</span>
      <span className='text-red-600 font-semibold text-sm'>Venta: {venta}</span>
    </div>
  );
};
