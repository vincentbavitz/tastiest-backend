import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeekOpenTimes } from '@tastiest-io/tastiest-horus';
import { UserRole } from '@tastiest-io/tastiest-utils';
import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';
import { AuthenticatedUser } from 'src/auth/auth.model';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { UsersService } from 'src/users/users.service';

// const MS_IN_ONE_MINUTE = 60 * 1000;

@Injectable()
export class RestaurantsService {
  /**
   * @ignore
   */
  constructor(
    private readonly userService: UsersService,
    private readonly firebaseApp: FirebaseService,
    private readonly configService: ConfigService,
    private readonly trackingService: TrackingService,
    private readonly emailSchedulingService: EmailSchedulingService,
    private prisma: PrismaService,
    private redis: RedisService,
    private http: HttpService,
  ) {}

  async createRestaurant(restaurantId: string) {
    null;
  }

  async getRestaurant(restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found.');
    }

    return restaurant;
  }

  async getOpenTimes(restaurantId: string) {
    const { metrics_open_times } = await this.getRestaurant(restaurantId);
    return metrics_open_times as WeekOpenTimes;
  }

  async setOpenTimes(
    restaurantId: string,
    openTimes: WeekOpenTimes,
    user: AuthenticatedUser,
  ) {
    this.validateRestaurantOwnership(user, restaurantId);

    // Does this restaurant exist? (Will throw error if not)
    await this.getRestaurant(restaurantId);

    await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: { metrics_open_times: openTimes },
    });

    return 'success';
  }

  async getBookingSlots(restaurantId: string) {
    // const restaurant = await this.getRestaurant(restaurantId);

    this.getBookingsFromERes(restaurantId);

    // What booking system does the restaurant use?
    // if (restaurant.booking_system === BookingSystem.E_RES) {
    // }
  }

  private async getBookingsFromERes(
    restaurantId: string,
    from: Date = new Date(),
    to: Date = DateTime.now().plus({ months: 1 }).toJSDate(),
  ) {
    restaurantId;

    // Store JWT token in Redis as well as last_authorized, and token expiry.
    // If last_authorized is older than a day, re-authorize.
    // const authToken = this.redis.eres_auth_token
    const authToken = await this.getAuthTokenFromERes();

    console.log('restaurants.service ➡️ authToken:', authToken);

    const base = 'https://secure.kernow-software.com/erestaurant/rest/api-v0.1';
    const endpoint = `${base}/tableReservation/list/${from.toISOString()}/${to.toISOString()}`;

    // const response = await this.http.get(endpoint, {
    //   headers: { Authorization: `Bearer ${authToken}` },
    // });
  }

  /**
   * Grabs a JWT token using our API key from e-Res.
   * If we already have a valid token, use it.
   * Otherwise, request a new one using their API.
   */
  private async getAuthTokenFromERes() {
    // Authorize eRes using our API key.
    const key = this.configService.get('BOOKING_SYSTEM_ERES_API_KEY') as string;

    // Store JWT token in Redis with a TTL matching the JWT token (one day).
    let eresJWT = await this.redis.get('eres-jwt');

    // Cool, we already have a token
    if (eresJWT) {
      return eresJWT;
    }

    // If the key no longer exists (JWT expired), re-authorize.
    console.log('FETCHING NEW TOKEN');

    const { data } = await firstValueFrom(
      this.http.post(
        'https://secure.kernow-software.com/erestaurant/rest/api-v0.1/token',
        {},
        { headers: { 'api-key': key } },
      ),
    );

    if (!data['Token'] || !data['Expiration']) {
      throw new InternalServerErrorException('E-Res Authorization failed');
    }

    // Save to Redis
    eresJWT = data['Token'];
    const ttlMillis = new Date(data['Expiration']).getTime() - Date.now();
    const ttl = Math.floor(ttlMillis / 1000);
    await this.redis.set('eres-jwt', eresJWT, ttl);

    return eresJWT;
  }

  // async scheduleFollowersEmail(data: NotifyDto) {
  //   const { token, restaurantId, templateId, subject, scheduleFor } = data;

  //   // Ensure the timing is valid
  //   // if (isBefore(scheduleFor, Date.now() + 5 * MS_IN_ONE_MINUTE)) {
  //   //   throw new BadRequestException(
  //   //     'Please schedule for at least 5 minutes in the future.',
  //   //   );
  //   // }

  //   // Receipients are all the restaurant's followers with notifications turned on.
  //   const restaurantDataApi =
  //     this.firebaseApp.getRestaurantDataApi(restaurantId);

  //   const restaurantData = await restaurantDataApi.getRestaurantData();
  //   const recipients = restaurantData.metrics.followers
  //     .filter((follower) => follower.notifications)
  //     .map((follower) => follower.email);

  //   dlog('restaurants.service ➡️ recipients:', recipients);

  //   // Get template and replace content's placeholders with real values.
  //   // Eg {{ firstName }} --> Daniel
  //   // TODO: Work out how to send a separate email to each follower with different content.
  //   const template = restaurantData.email?.templates?.[templateId] ?? null;
  //   if (!template) {
  //     throw new NotFoundException('Could not find template.');
  //   }

  //   if (!template.isApproved) {
  //     throw new BadRequestException('Template is not approved.');
  //   }

  //   const content = template.html;

  //   return this.emailSchedulingService.scheduleEmail({
  //     recipients,
  //     subject,
  //     content,
  //     date: new Date(scheduleFor).toUTCString(),
  //   });
  // }

  // async applyAsRestaurateur(
  //   applicationData: ApplyDto,
  //   user: AuthenticatedUser,
  // ) {
  //   const applicationEntity = this.applicationsRepository.create({
  //     ...applicationData,
  //   });

  //   await this.trackingService.track(
  //     'New Restaurateur Application',
  //     {
  //       userId: user?.uid,
  //     },
  //     applicationEntity,
  //   );

  //   const application = await this.applicationsRepository.save(
  //     applicationEntity,
  //   );

  //   return { ...application, id: undefined };
  // }

  /**
   * Throws an error if the request is not coming from an Admin or the user
   * who owns the restaurant.
   */
  private validateRestaurantOwnership(
    user: AuthenticatedUser,
    restaurantId: string,
  ) {
    if (user.roles.includes(UserRole.ADMIN)) {
      return;
    }

    if (user.uid !== restaurantId) {
      throw new ForbiddenException();
    }
  }
}
