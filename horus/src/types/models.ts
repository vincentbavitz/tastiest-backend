/* eslint-disable prettier/prettier */
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////////////////////     THIS FILE IS AUTO-GENERATED.   //////////////////////
/////////////////////     DO NOT EDIT                    //////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


/**
 * Model User
 * 
 */
export type HorusUser = {
  /**
   * Set by Firebase Auth.
   */
  id: string
  email: string
  first_name: string
  last_name: string | null
  mobile: string | null
  birthday: Date | null
  location_lat: number | null
  location_lon: number | null
  location_address: string | null
  location_postcode: string | null
  location_display: string | null
  stripe_customer_id: string | null
  stripe_setup_secret: string | null
  is_test_account: boolean
  created_at: Date | null
  last_active: Date | null
}


/**
 * Model Order
 * 
 */
export type HorusOrder = {
  id: string
  token: string
  user_facing_id: string
  booked_for: Date
  heads: number
  from_slug: string
  price: OrderPrice
  refund: RefundDetails | null
  payment_card: PaymentCardDetails | null
  payment_method: string | null
  discount_code: string | null
  created_at: Date | null
  updated_at: Date | null
  paid_at: Date | null
  abandoned_at: Date | null
  tastiest_portion: number | null
  restaurant_portion: number | null
  /**
   * Specifically at the time the order was made.
   */
  is_user_following: boolean
  is_test: boolean
  product_id: string
  user_id: string
  restaurant_id: string
}


/**
 * Model Booking
 * 
 */
export type HorusBooking = {
  id: string
  booked_for: Date
  cancelled_at: Date | null
  confirmation_code: string
  has_arrived: boolean
  has_cancelled: boolean
  is_test: boolean
  is_confirmation_code_verified: boolean
  is_synced_with_booking_system: boolean
  restaurant_id: string
  order_id: string
  user_id: string
}


/**
 * Model Restaurant
 * 
 */
export type HorusRestaurant = {
  /**
   * Set by Firebase Auth.
   */
  id: string
  name: string
  city: string
  cuisine: string
  uri_name: string
  location_lat: number | null
  location_lon: number | null
  location_address: string | null
  location_postcode: string | null
  location_display: string | null
  contact_first_name: string | null
  contact_last_name: string | null
  contact_email: string | null
  contact_phone_number: string | null
  realtime_available_booking_slots: string[]
  realtime_last_slots_sync: Date | null
  booking_system: string | null
  has_accepted_terms: boolean
  financial_connect_account: StripeAccount | null
  financial_cut_default: number | null
  financial_cut_followers: number | null
  metrics_quiet_times: WeekQuietTimes | null
  metrics_open_times: WeekOpenTimes | null
  metrics_seating_duration: number | null
  settings_notify_bookings: boolean
  settings_fallback_open_times: boolean
  is_demo: boolean
  is_archived: boolean
  is_setup_complete: boolean
}


/**
 * Model RestaurantProfile
 * 
 */
export type HorusRestaurantProfile = {
  id: string
  website: string | null
  public_phone_number: string | null
  profile_picture: Media | null
  backdrop_video: Media | null
  backdrop_still_frame: Media | null
  display_photograph: Media | null
  hero_illustration: Media | null
  description: Document | null
  meta: MetaDetails | null
  restaurant_id: string
}


/**
 * Model ExperiencePost
 * 
 */
export type HorusExperiencePost = {
  id: string
  title: string
  date: Date
  body: Document | null
  city: string
  cuisine: string
  description: string
  see_restaurant_button: string | null
  /**
   * Eg. East London
   * Displayed under the title
   */
  display_location: string
  plate_image: Media | null
  menu_image: Media | null
  auxiliary_image: Media | null
  meta: MetaDetails | null
  slug: string
  tags: string[]
  product_id: string
  restaurant_id: string
}


/**
 * Model ExperienceProduct
 * 
 */
export type HorusExperienceProduct = {
  id: string
  name: string
  allowed_heads: number[]
  image: Media | null
  /**
   * Per head, in GBP
   */
  price: number
  restaurant_id: string
}


/**
 * Model RestaurateurApplication
 * 
 */
export type HorusRestaurateurApplication = {
  id: string
  name: string
  email: string
  contact_number: string
  restaurant_name: string
  restaurant_website: string
  restaurant_address: string
  description: string
}


/**
 * Model AffiliateSubmission
 * 
 */
export type HorusAffiliateSubmission = {
  id: string
  platform: string
  reference: string
  affiliate_type: string
  user_id: string | null
}


