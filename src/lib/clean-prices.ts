import { Prices, Remate } from '@/app/(Task)/remates/components/Remates.types';

export const cleanRemates = (remates: Remate[], prices: Prices) => {
  const cleanPrices = (currency: string, amount: string) => {
    type Currency = 'PEN' | 'USD';
    const Locate: Record<string, Currency> = {
      USD: 'PEN',
      PEN: 'USD',
    };

    const getPrice = parseFloat(amount.replace(/,/g, ''));
    const getCurrency =
      currency === 'USD' ? parseFloat(prices.venta) : parseFloat(prices.compra);

    const price =
      currency === 'USD' ? getPrice * getCurrency : getPrice / getCurrency;
    return price
      .toLocaleString(currency === 'USD' ? 'es-PE' : 'en-US', {
        currency: Locate[currency],
        style: 'currency',
      })
      .replace('$', '$ ');
  };

  return remates.map((remate) => {
    const { currency, amount } = remate.price;
    return {
      ...remate,
      price: {
        ...remate.price,
        converted: cleanPrices(currency, amount),
      },
    };
  });
};
