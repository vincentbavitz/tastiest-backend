import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
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
  ) {}

  async createRestaurant(restaurantId: string) {
    null;
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
}
