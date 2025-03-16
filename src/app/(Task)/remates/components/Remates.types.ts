interface OfferDate {
  date: string;
  hour: string;
}

interface Price {
  currency: 'USD' | 'PEN' | string;
  amount: string;
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
