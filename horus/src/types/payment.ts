export type DiscountAmount = { value: number; unit: '%' | '£' };

export type Currency = 'GBP' | 'USD' | 'EUR' | 'AUD';

export type PaymentCardDetails = {
  brand: string;
  last4: string;
};

export type CurrencyValue = {
  amount: number;
  currency: Currency;
};

export type RefundDetails = CurrencyValue & {
  refundedAt: number;
  note?: string;
};

export type OrderPrice = {
  subtotal: number;
  fees: number;

  /** After discount and etc applied */
  final: number;
  currency: Currency;
};
