import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Booking } from '@prisma/client';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { OrderWithUserAndRestaurant } from 'src/orders/orders.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';

const MS_IN_ONE_MINUTE = 60 * 1000;

@Injectable()
export class BookingsService {
  private BookingNotFoundException = new NotFoundException(
    `Booking with the given ID doesn't exist.`,
  );

  /**
   * @ignore
   */
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private trackingService: TrackingService,
    private prisma: PrismaService,
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

      return this.prisma.booking.findMany();
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
   *
   * Ordinarily, coming from /bookings/:id, the uid comes from
   * an authenticated user, so we can be sure no unauthenticated user
   * can access bookings that aren't theirs.
   */
  async getBooking(
    id: string,
    userId: string,
    include?: Array<'order' | 'user'>,
  ) {
    // Test against userId and bookingId to ensure the user owns it.
    const booking = await this.prisma.booking.findFirst({
      where: { id, user_id: userId },
      include: {
        order: include.includes('order'),
        user: include.includes('user'),
      },
    });

    // Does the booking exist?
    if (!booking) {
      throw this.BookingNotFoundException;
    }

    return booking;
  }

  async getBookingsOfUser(uid: string, fromRestaurantId?: string) {
    const where = { user_id: uid };
    if (fromRestaurantId) {
      where['restaurant_id'] = fromRestaurantId;
    }

    return this.prisma.booking.findMany({
      where,
      include: { order: true, user: true, restaurant: true },
    });
  }

  async getBookingsOfRestaurant(restaurantId: string) {
    return this.prisma.booking.findMany({
      where: { restaurant_id: restaurantId },
      include: { order: true, user: true, restaurant: true },
    });
  }

  /**-
   * Update the values `has_arrived`, `has_cancelled` or `booked_for` on a booking.
   * Note that only admins...
   * 1. may modify `has_arrived` when `has_arrived` is true
   * 2. may modify `has_cancelled` when `has_cancelled` is true
   * 3. may modify `booked_for` when `has_cancelled` or `has_arrived` is true.
   * 4. may set `booked_for` to a date that is in the past.
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
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId },
      include: { user: true, order: true, restaurant: true },
    });

    // Ensure booking exists and is accessible for this user.
    this.validateBookingExistenceAndOwnership(user, booking);

    if (!booking) {
      throw this.BookingNotFoundException;
    }

    const updatedBooking: typeof booking = { ...booking };

    // Can't modify if they've arrived or cancelled.
    // Admins can override this.
    if (
      !user.roles.includes(UserRole.ADMIN) &&
      (booking.has_arrived || booking.has_cancelled)
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
          'Can not set `booked_for_timestamp` to a date in the past.',
        );
      }

      // Reschedule the booking's prior-to-arrival notification
      await this.schedulePriorToArrivalNotification(booking);

      // prettier-ignore
      updatedBooking.booked_for = new Date(bookedForTimestamp)
    }

    // Is the hasArrived value different and valid?
    if (hasArrived !== undefined && hasArrived !== booking.has_arrived) {
      updatedBooking.has_arrived = hasArrived;

      const userFullname = booking.user.last_name
        ? `${booking.user.first_name} ${booking.user.last_name}`
        : booking.user.first_name;

      // Track `Arrived` with Segment
      if (updatedBooking.has_arrived) {
        await this.trackingService.track('Eater Arrived', {
          who: { userId: booking.user_id },
          properties: {
            name: userFullname,
            email: booking.user,
            booking_id: booking.id,
            restaurant: booking.restaurant,
            customerUserId: booking.user_id,
            booking: updatedBooking,
          },
        });
      }
    }

    // Is the hasCancelled value different and valid?
    if (hasCancelled !== undefined && hasCancelled !== booking.has_cancelled) {
      updatedBooking.has_cancelled = hasCancelled;

      // Track update in Segment
      if (updatedBooking.has_cancelled) {
        await this.trackingService.track('Booking Cancelled', {
          who: {
            userId: user.uid,
          },
          properties: {
            booking_id: booking.id,
            email: booking.user.email,
            restaurant: booking.restaurant,
            customerUserId: booking.user_id,
            booking: updatedBooking,
          },
        });
      }
    }

    // Update booking in database
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        has_arrived: hasArrived,
        has_cancelled: hasCancelled,
        cancelled_at: hasCancelled ? new Date() : undefined,
        booked_for: bookedForTimestamp
          ? new Date(bookedForTimestamp)
          : undefined,
      },
    });

    // Update the corresponding order
    await this.prisma.order.update({
      where: { id: booking.order_id },
      data: {
        booked_for: bookedForTimestamp
          ? new Date(bookedForTimestamp)
          : undefined,
      },
    });

    // Update the corresponding order and track
    if (
      bookedForTimestamp &&
      bookedForTimestamp !== new Date(booking.booked_for).getTime()
    ) {
      // Track update in Segment
      await this.trackingService.track('Booking Date Updated', {
        who: { userId: user.uid },
        properties: {
          booking_id: booking.id,
          email: booking.user.email,
          restaurant: booking.restaurant,
          customerUserId: booking.user_id,
          booking: updatedBooking,
        },
      });
    }

    return 'success';
  }

  /**
   * Create a new booking; done ONLY form the PaymentsService
   */
  async createBooking(order: OrderWithUserAndRestaurant) {
    const booking = await this.prisma.booking.create({
      data: {
        booked_for: order.booked_for,
        confirmation_code: this.generateConfirmationCode(),
        is_test: order.is_test,
        restaurant: { connect: { id: order.restaurant_id } },
        order: { connect: { id: order.id } },
        user: { connect: { id: order.user_id } },
      },
    });

    // Schedule the prior-to-arrival notification.
    await this.schedulePriorToArrivalNotification(booking);

    return booking;
  }

  /**
   * Confirmation code required for user to show restaurant
   */
  private generateConfirmationCode() {
    // Random number between 1 and 9
    const randomDigit = () => Math.floor(Math.random() * 10);

    return Array(4)
      .fill(null)
      .map((_) => String(randomDigit()))
      .join('');
  }

  /**
   * Schedule a notification to be fired prior to the user arriving
   * to their booking.
   */
  private async schedulePriorToArrivalNotification(
    booking: Booking,
    minsPrior = 60,
  ) {
    // Is the booking cancelled or has the user already arrived?
    if (booking.has_cancelled || booking.has_arrived) {
      console.log(
        'schedulePriorToArrivalNotification: Booking cancelled or user already arrived',
      );
      return;
    }

    // Clear previous scheduled notification
    this.schedulerRegistry.deleteTimeout(
      `attemptPriorToArrivalNotification-${booking.id}`,
    );

    const arrivalAt = booking.booked_for.getTime();
    const now = Date.now();

    const scheduledMsFromNow = arrivalAt - minsPrior * MS_IN_ONE_MINUTE - now;

    // Too late; they've already arrived.
    if (scheduledMsFromNow < 0) {
      console.log('schedulePriorToArrivalNotification: User already arrived');
      return;
    }

    const callback = () => {
      console.log(`Interval executing at time (${scheduledMsFromNow})!`);

      this.attemptPriorToArrivalNotification(
        booking.id,
        booking.user_id,
        minsPrior,
      );
    };

    const timeout = setTimeout(callback, scheduledMsFromNow);

    this.schedulerRegistry.addTimeout(
      `attemptPriorToArrivalNotification-${booking.id}`,
      timeout,
    );
  }

  /**
   * Attempt to send a notification to the user prior to their arrival.
   */
  private async attemptPriorToArrivalNotification(
    bookingId: string,
    userId: string,
    minsPrior: number,
  ) {
    // Get booking from scratch in case it has changed since it was scheduled.
    const booking = await this.getBooking(bookingId, userId, ['order', 'user']);

    // Is the booking cancelled or has the user already arrived?
    if (booking.has_cancelled || booking.has_arrived) {
      console.log(
        'attemptPriorToArrivalNotification: Booking cancelled or user already arrived',
      );
      return;
    }

    // We make sure we haven't already sent an prior-to-arrival notification to the user.
    if (booking.sent_prior_to_arrival_notification) {
      console.log(
        'attemptPriorToArrivalNotification: Already sent prior-to-arrival notification',
      );
      return;
    }

    // Are we somehow being called after booking?
    if (Date.now() > booking.booked_for.getTime()) {
      console.log(
        'attemptPriorToArrivalNotification: Being called after booking complete!',
      );
      return;
    }

    // Eg; if minsPrior is 1HR, we are checking if the booking is actually in an hour or less.
    const isArrivalInTimePrior =
      booking.booked_for.getTime() - Date.now() < minsPrior * MS_IN_ONE_MINUTE;

    // In this case the booking has changed since this was scheduled;
    // reschedule for later
    if (!isArrivalInTimePrior) {
      return this.schedulePriorToArrivalNotification(booking);
    }

    // Fire off event for Notification
    this.trackingService.track('Pre-Arrival Notification', {
      who: { userId: booking.user_id },
      properties: {
        ...booking,
      },
    });

    // Update booking sent_prior_to_arrival_notification
    return this.prisma.booking.update({
      where: { id: booking.id },
      data: { sent_prior_to_arrival_notification: true },
    });
  }

  /**
   * Validate that the request is coming from the owner
   * of the booking, the corresponding restaurant or an admin.
   */
  private validateBookingExistenceAndOwnership(
    user: AuthenticatedUser,
    booking: Booking,
  ) {
    if (!booking) {
      throw this.BookingNotFoundException;
    }

    // Admins can view all bookings.
    if (user.roles.includes(UserRole.ADMIN)) {
      return true;
    }

    // Does it belong to the user?
    if (user.roles.includes(UserRole.EATER)) {
      if (booking.user_id !== user.uid) {
        throw new ForbiddenException();
      }
    }

    // Does it belong to the restaurant?
    if (user.roles.includes(UserRole.RESTAURANT)) {
      return booking.restaurant_id === user.uid;
    }

    throw new ForbiddenException();
  }
}
