import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Booking } from '@prisma/client';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { AuthenticatedUser } from 'src/auth/auth.model';
import { OrderWithUserAndRestaurant } from 'src/orders/orders.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingService } from 'src/tracking/tracking.service';

@Injectable()
export class BookingsService {
  private BookingNotFoundException = new NotFoundException(
    `Booking with the given ID doesn't exist.`,
  );

  /**
   * @ignore
   */
  constructor(
    private readonly trackingService: TrackingService,
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
   */
  async getBooking(id: string, user: AuthenticatedUser) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, user_id: user.uid },
    });

    // Does the booking exist?
    if (!booking) {
      throw this.BookingNotFoundException;
    }

    // Ensure the request is coming from the owner of the ticket or an admin.
    this.validateBookingExistenceAndOwnership(user, booking);

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

  /**
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
    return this.prisma.booking.create({
      data: {
        booked_for: order.booked_for,
        confirmation_code: this.generateConfirmationCode(),
        is_test: order.is_test,
        restaurant: { connect: { id: order.restaurant_id } },
        order: { connect: { id: order.id } },
        user: { connect: { id: order.user_id } },
      },
    });
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
