import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AvailableSlot } from '@tastiest-io/tastiest-horus';
import { FirestoreCollection } from '@tastiest-io/tastiest-utils';
import { DateTime, Zone } from 'luxon';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';

// FIX ME - Create a new prisma model for reservations which includes user data where possible as well as lastUpdated, etc etc
type Reservation = {
  /** Time and date the reservation is booked for */
  bookedFor: Date;

  /** Duration given in mintues */
  duration: number;
  covers: number;

  bookedThroughTastiest: boolean;
};

type SanitizedReservation = Pick<
  Reservation,
  'duration' | 'covers' | 'bookedFor'
>;

/**
 * The reservations service collates all restaurants' reservation-managers / systems
 * into one universal reservation manager.
 *
 * For example, a restaurant who uses the e-Res booking system and a restaurant who uses
 * another proprietary systen will be accessible with the same parameters and types
 * through this service.
 */
@Injectable()
export class ReservationsService {
  private readonly eresBaseEndpoint: string;

  /**
   * @ignore
   */
  constructor(
    private restaurantsService: RestaurantsService,
    private configService: ConfigService,
    private firebase: FirebaseService,
    private prisma: PrismaService,
    // private redis: RedisService,
    private http: HttpService,
  ) {
    this.eresBaseEndpoint = `https://secure.kernow-software.com/erestaurant/rest/api-v0.1`;
  }

  /**
   * Get available datetimes which are open for bookings.
   * Note. In the future it would be prudent to take parameters like
   * `heads`, `duration`, etc in order to better operate with the
   * restaurant's internal booking system.
   *
   * Returns an array of slots having the type `AvailableSlot`
   * as well as the last successful sync (as a millisecond timestamp).
   */
  async getOpenSlots(restaurantId: string, timezone: Zone) {
    // NOTE! 19 March 2022
    // For now we get the infromation from Firebase until e-Res gives us a nice API.
    // We are only working with Numa and El-Vaquero for now so we're only using e-Res.

    const restaurantFirestoreSnapshot = await this.firebase
      .db(FirestoreCollection.RESTAURANTS)
      .doc(restaurantId)
      .get();

    const restaurantFirestore = restaurantFirestoreSnapshot.data();
    const realtime = restaurantFirestore?.realtime;

    const slotsISO8601: string[] = realtime?.availableBookingSlots ?? [];
    const last_synced = realtime?.lastBookingSlotsSync ?? -1;

    const slots: AvailableSlot[] = slotsISO8601.map((slot) => {
      const datetime = DateTime.fromISO(slot).setZone(timezone);
      return {
        ordinal: datetime.ordinal,
        timestamp: datetime.toMillis(),
        minutes_into_day: datetime.hour * 60 + datetime.minute,
        duration: null,
      };
    });

    return { slots, last_synced };
  }

  /**
   * With `sanitize=true`, it ensures that the users calling from the front-end don't get any
   * detailed information about who booked.
   *
   * Only used unsanitized for internal calls.
   */
  // async getReservations(restaurantId: string, sanitize = true) {
  //   const restaurant = await this.restaurantsService.getRestaurant(
  //     restaurantId,
  //   );

  //   // What booking system does the restaurant use?
  //   if (restaurant.booking_system === BookingSystem.E_RES) {
  //     const reservations = await this.getReservationsFromERes(restaurantId);
  //     return sanitize ? this.sanitize(reservations) : reservations;
  //   }
  // }

  /**
   * Note that we can make this 10x faster if we create a task to sync
   * reservations to our database every 5 minutes or so.
   * But for now (19 March 2022) I think the load on our server(s) will be
   * too much once we have a lot of reservation systems in place to be
   * syncing all the time.
   *
   * Thus, we fetch when required directly from e-Res.
   */
  // private async getReservationsFromERes(
  //   restaurantId: string,
  //   from: Date = new Date(),
  //   to: Date = DateTime.now().plus({ months: 1 }).toJSDate(),
  // ) {
  //   const jwt = await this.getAuthTokenFromERes();
  //   restaurantId;

  //   const endpoint =
  //     this.eresBaseEndpoint +
  //     `/tableReservation/list/${from.toISOString()}/${to.toISOString()}`;

  //   const { data } = await firstValueFrom(
  //     this.http.get(endpoint, { headers: { Authorization: `Bearer ${jwt}` } }),
  //   );

  //   if (!data.success) {
  //     throw new InternalServerErrorException(
  //       'Error getting e-Res reservations',
  //     );
  //   }

  //   return data.data?.reservations ?? [];
  // }

  /**
   * Grabs a JWT token using our API key from e-Res.
   * If we already have a valid token, use it.
   * Otherwise, request a new one using their API.
   */
  // private async getAuthTokenFromERes() {
  //   // Authorize eRes using our API key.
  //   const key = this.configService.get('BOOKING_SYSTEM_ERES_API_KEY') as string;

  //   // Store JWT token in Redis with a TTL matching the JWT token (one day).
  //   let eresJWT = await this.redis.get('eres-jwt');

  //   // Cool, we already have a token
  //   if (eresJWT) {
  //     return eresJWT;
  //   }

  //   // If the key no longer exists (JWT expired), re-authorize.
  //   const { data } = await firstValueFrom(
  //     this.http.post(
  //       this.eresBaseEndpoint + '/token',
  //       {},
  //       { headers: { 'api-key': key } },
  //     ),
  //   );

  //   if (!data['Token'] || !data['Expiration']) {
  //     throw new InternalServerErrorException('E-Res Authorization failed');
  //   }

  //   // Save to Redis
  //   eresJWT = data['Token'];
  //   const ttlMillis = new Date(data['Expiration']).getTime() - Date.now();
  //   const ttl = Math.floor(ttlMillis / 1000);
  //   await this.redis.set('eres-jwt', eresJWT, ttl);

  //   return eresJWT;
  // }

  private sanitize(reservations: Reservation[]): SanitizedReservation[] {
    reservations.forEach((r) => console.log('R:', r));

    return reservations.map((r) => ({
      covers: r.covers,
      bookedFor: r.bookedFor,
      duration: r.duration,
    }));
  }
}
