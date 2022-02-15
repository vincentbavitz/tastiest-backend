import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Booking,
  FirestoreCollection,
  TIME,
  UserRole,
} from '@tastiest-io/tastiest-utils';
import { DateTime } from 'luxon';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { UserEntity } from 'src/entities/user.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { Repository } from 'typeorm';

@Injectable()
export class BookingsService {
  /**
   * @ignore
   */
  constructor(
    private readonly firebaseApp: FirebaseService,
    private readonly trackingService: TrackingService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getBookings(
    user: AuthenticatedUser,
    userId?: string,
    restaurantId?: string,
  ) {
    // Only admins can get all bookings
    if (!userId && !restaurantId && !user.roles.includes(UserRole.ADMIN)) {
      throw new ForbiddenException();
    }

    // Admins can view all bookings
    if (user.roles.includes(UserRole.ADMIN)) {
      if (userId) {
        return this.getBookingsOfUser(userId, restaurantId);
      }

      if (restaurantId) {
        return this.getBookingsOfRestaurant(restaurantId);
      }

      const bookingsSnapshot = await this.firebaseApp
        .db(FirestoreCollection.BOOKINGS)
        .get();

      const bookings: Booking[] = [];
      bookingsSnapshot.forEach((booking) =>
        bookings.push(booking.data() as Booking),
      );

      return bookings;
    }

    // If user, ensure they have the permissions to view.
    if (user.roles.includes(UserRole.EATER)) {
      if (userId !== user.uid) {
        throw new ForbiddenException();
      }

      return this.getBookingsOfUser(userId, restaurantId);
    }

    // If restaurant, ensure they own it.
    if (user.roles.includes(UserRole.RESTAURANT)) {
      if (restaurantId !== user.uid) {
        throw new ForbiddenException();
      }

      // Get bookings of this restaurant only from this user.
      if (userId) {
        return this.getBookingsOfUser(userId, restaurantId);
      }

      return this.getBookingsOfRestaurant(restaurantId);
    }
  }

  /**
   * Get booking with the corresponding ID.
   * NB. The booking ID is equivalent to the corresponding order ID.
   */
  async getBooking(id: string, user: AuthenticatedUser) {
    const bookingSnapshot = await this.firebaseApp
      .db(FirestoreCollection.BOOKINGS)
      .doc(id)
      .get();

    // Does the booking exist?
    if (!bookingSnapshot.exists) {
      throw new NotFoundException(`Booking with the given ID doesn't exist.`);
    }

    const booking = bookingSnapshot.data() as Booking;

    // Ensure the request is coming from the owner of the ticket or an admin.
    if (!this.validateBookingOwnership(user, booking)) {
      throw new ForbiddenException();
    }

    return booking;
  }

  async getBookingsOfUser(uid: string, fromRestaurantId?: string) {
    const query = fromRestaurantId
      ? this.firebaseApp
          .db(FirestoreCollection.BOOKINGS)
          .where('userId', '==', uid)
          .where('restaurantId', '==', fromRestaurantId)
      : this.firebaseApp
          .db(FirestoreCollection.BOOKINGS)
          .where('userId', '==', uid);

    const bookingsSnapshot = await query.get();

    const bookings: Booking[] = [];
    bookingsSnapshot.forEach((booking) =>
      bookings.push(booking.data() as Booking),
    );

    return bookings;
  }

  async getBookingsOfRestaurant(restaurantId: string) {
    const bookingsSnapshot = await this.firebaseApp
      .db(FirestoreCollection.BOOKINGS)
      .where('restaurantId', '==', restaurantId)
      .get();

    const bookings: Booking[] = [];
    bookingsSnapshot.forEach((booking) =>
      bookings.push(booking.data() as Booking),
    );

    return bookings;
  }

  /**
   * Update the values `hasArrived`, `hasCancelled` or `bookedForTimestamp` on a booking.
   * Note that only admins...
   * 1. may modify `hasArrived` when `hasCancelled` is true
   * 2. may modify `hasCancelled` when `hasArrived` is true
   * 3. may modify `bookedForTimestamp` when `hasCancelled` or `hasArrived` is true.
   * 4. may set `bookedForTimestamp` to a date that is in the past.
   */
  async updateBooking(
    bookingId: string,
    user: AuthenticatedUser,
    {
      hasArrived,
      hasCancelled,
      bookedForTimestamp,
    }: {
      hasArrived?: boolean;
      hasCancelled?: boolean;
      bookedForTimestamp?: number;
    },
  ) {
    if (
      hasArrived === undefined &&
      hasCancelled === undefined &&
      bookedForTimestamp === undefined
    ) {
      throw new BadRequestException(
        'Nothing to update. Please provide at least one update parameter.',
      );
    }

    // This automatically verifies the booking ownership.
    const booking = await this.getBooking(bookingId, user);
    const updatedBooking: Booking = { ...booking };

    // Can't modify if they've arrived or cancelled.
    // Admins can override this.
    if (
      !user.roles.includes(UserRole.ADMIN) &&
      (booking.hasArrived || booking.hasCancelled)
    ) {
      throw new BadRequestException(
        'Booking can not be modified after the customer has arrived or the booking has been cancelled.',
      );
    }

    // Is the new booking timestamp valid?
    if (bookedForTimestamp) {
      // Admins are allowed to set bookings in the past.
      if (
        !user.roles.includes(UserRole.ADMIN) &&
        bookedForTimestamp < Date.now()
      ) {
        throw new NotAcceptableException(
          'Can not set `bookedForTimestamp` to a date in the past.',
        );
      }

      // prettier-ignore
      updatedBooking.bookedForHumanDate = DateTime.fromMillis(bookedForTimestamp, {zone: TIME.LOCALES.LONDON}).toFormat('hh:mm a, DDD');
      updatedBooking.bookedForTimestamp = bookedForTimestamp;
    }

    // Is the hasArrived value different and valid?
    if (hasArrived !== undefined && hasArrived !== booking.hasArrived) {
      updatedBooking.hasArrived = hasArrived;

      // Track `Arrived` with Segment
      if (updatedBooking.hasArrived) {
        await this.trackingService.track(
          'Eater Arrived',
          { userId: booking.userId },
          {
            email: booking.eaterEmail,
            bookingId: booking.orderId,
            restaurant: booking.restaurant,
            customerUserId: booking.userId,
            booking: updatedBooking,
          },
        );
      }
    }

    // Is the hasCancelled value different and valid?
    if (hasCancelled !== undefined && hasCancelled !== booking.hasCancelled) {
      updatedBooking.hasCancelled = hasCancelled;

      // Track update in Segment
      if (updatedBooking.hasCancelled) {
        await this.trackingService.track(
          'Booking Cancelled',
          {
            userId: user.uid,
          },
          {
            email: booking.eaterEmail,
            bookingId: booking.orderId,
            restaurant: booking.restaurant,
            customerUserId: booking.userId,
            booking: updatedBooking,
          },
        );
      }
    }

    // Update booking in Firestore
    await this.firebaseApp.db(FirestoreCollection.BOOKINGS).doc(bookingId).set(
      {
        hasArrived: updatedBooking.hasArrived,
        hasCancelled: updatedBooking.hasCancelled,
        bookedForTimestamp: updatedBooking.bookedForTimestamp,
        bookedForHumanDate: updatedBooking.bookedForHumanDate,
      },
      { merge: true },
    );

    // Update the corresponding order and track
    if (
      bookedForTimestamp &&
      bookedForTimestamp !== booking.bookedForTimestamp
    ) {
      // Track update in Segment
      await this.trackingService.track(
        'Booking Date Updated',
        { userId: user.uid },
        {
          email: booking.eaterEmail,
          bookingId: booking.orderId,
          restaurant: booking.restaurant,
          customerUserId: booking.userId,

          before: {
            hasArrived: booking.hasArrived,
            hasCancelled: booking.hasCancelled,
            bookedForTimestamp: booking.bookedForTimestamp,
            bookedForHumanDate: booking.bookedForHumanDate,
          },
          after: {
            hasArrived: updatedBooking.hasArrived,
            hasCancelled: updatedBooking.hasCancelled,
            bookedForTimestamp: updatedBooking.bookedForTimestamp,
            bookedForHumanDate: updatedBooking.bookedForHumanDate,
          },

          ...updatedBooking,
        },
      );

      await this.firebaseApp
        .db(FirestoreCollection.ORDERS)
        .doc(bookingId)
        .set({ bookedForTimestamp }, { merge: true });
    }

    return {
      bookingId,
      hasArrived: updatedBooking.hasArrived,
      hasCancelled: updatedBooking.hasCancelled,
      bookedForTimestamp: updatedBooking.bookedForTimestamp,
      bookedForHumanDate: updatedBooking.bookedForHumanDate,
    };
  }

  //   async updateTicket(data: UpdateUserTicketDto) {
  //     const ref = this.firebaseApp
  //       .db(FirestoreCollection.SUPPORT_USERS)
  //       .doc(data.ticketId);

  //     const originalSnapshot = await ref.get();
  //     const original = originalSnapshot.data() as UserSupportRequest;

  //     // Updated file
  //     const updated = { ...original };

  //     if (data.priority !== undefined) updated.priority = data.priority;
  //     if (data.resolved !== undefined) updated.resolved = data.resolved;
  //     if (data.type !== undefined) updated.type = data.type;

  //     // Have we actually changed anything?
  //     // If not, just return.
  //     if (isEqual(original, updated)) {
  //       console.log('Nothing changed');
  //       return { message: 'critical' };
  //     }

  //     // Save new to Firestore
  //     const ticket: UserSupportRequest = {
  //       ...original,
  //       ...updated,
  //       updatedAt: Date.now(),
  //     };

  //     await ref.set(ticket, { merge: true });
  //   }

  /**
   * Validate that the request is coming from the owner
   * of the booking, the corresponding restaurant or an admin.
   */
  private validateBookingOwnership(user: AuthenticatedUser, booking: Booking) {
    // Admins can view all bookings.
    if (user.roles.includes(UserRole.ADMIN)) {
      return true;
    }

    // Does it belong to the user?
    if (user.roles.includes(UserRole.EATER)) {
      return booking.userId === user.uid;
    }

    // Does it belong to the restaurant?
    if (user.roles.includes(UserRole.RESTAURANT)) {
      return booking.restaurantId === user.uid;
    }

    return false;
  }
}
