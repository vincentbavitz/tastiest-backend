/* eslint-disable prettier/prettier */
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////////////////////     THIS FILE IS AUTO-GENERATED.   //////////////////////
/////////////////////             DO NOT EDIT            //////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export type HorusRoutesGET =
  | '/accounts/:uid'
  | '/server/system-stats'
  | '/bookings/:id'
  | '/orders/:token'
  | '/reservations/public/open-slots'
  | '/reservations/list'
  | '/restaurants/public/open-times'
  | '/users/:uid'
  | '/users/me';

export type HorusRoutesPOST =
  | '/accounts/setRole'
  | '/public/affiliates/new-submission'
  | '/auth/public/register'
  | '/bookings/update'
  | '/email-scheduling/schedule'
  | '/orders/new'
  | '/orders/update'
  | '/payments/pay'
  | '/payments/public/payment-success-webhook'
  | '/restaurants/public/connect-account-webhook'
  | '/restaurants/set-open-times'
  | '/restaurants/notify'
  | '/restaurants/public/apply'
  | '/public/syncs/segment'
  | '/public/syncs/contentful/restaurant'
  | '/users/update'
  | '/users/follow-restaurant'
  | '/users/unfollow-restaurant';

