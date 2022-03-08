// Time
type TimeRange = import('./time').TimeRange;
type DateObject = import('./time').DateObject;
type OpenTimesMetricDay = import('./time').OpenTimesMetricDay;
type QuietTimesMetricDay = import('./time').QuietTimesMetricDay;
type WeekOpenTimes = import('./time').WeekOpenTimes;
type WeekQuietTimes = import('./time').WeekQuietTimes;

// Payment
type Currency = import('./payment').Currency;
type CurrencyValue = import('./payment').CurrencyValue;
type DiscountAmount = import('./payment').DiscountAmount;
type OrderPrice = import('./payment').OrderPrice;
type RefundDetails = import('./payment').RefundDetails;
type PaymentCardDetails = import('./payment').PaymentCardDetails;

type StripeAccount = import('stripe').Stripe.Account;

// Generic
type Media = import('./media').Media;
type MetaDetails = import('./media').MetaDetails;
