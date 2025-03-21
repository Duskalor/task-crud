interface OfferDate {
  date: string;
  hour: string;
}

interface Price {
  currency: 'USD' | 'PEN' | string;
  amount: string;
  converted: string;
}

export interface Remate {
  id: string;
  title: string;
  type: string;
  description: string;
  location: string;
  price: Price;
  process: string;
  'Offer Date': OfferDate;
  createdAt: string;
}

export interface Prices {
  id: string;
  compra: string;
  venta: string;
  created_at: string;
}
