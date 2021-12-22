import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { dlog } from '@tastiest-io/tastiest-utils';
import EmailSchedulingService from 'src/email/schedule/email-schedule.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import NotifyDto from './dto/notify.dto';

// const MS_IN_ONE_MINUTE = 60 * 1000;

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
    private readonly firebaseApp: FirebaseService,
  ) {}

  async scheduleFollowersEmail(data: NotifyDto) {
    const { token, restaurantId, templateId, subject, scheduleFor } = data;

    // Ensure the timing is valid
    // if (isBefore(scheduleFor, Date.now() + 5 * MS_IN_ONE_MINUTE)) {
    //   throw new BadRequestException(
    //     'Please schedule for at least 5 minutes in the future.',
    //   );
    // }

    // Receipients are all the restaurant's followers with notifications turned on.
    const restaurantDataApi =
      this.firebaseApp.getRestaurantDataApi(restaurantId);

    const restaurantData = await restaurantDataApi.getRestaurantData();
    const recipients = restaurantData.metrics.followers
      .filter((follower) => follower.notifications)
      .map((follower) => follower.email);

    dlog('restaurants.service ➡️ recipients:', recipients);

    // Get template and replace content's placeholders with real values.
    // Eg {{ firstName }} --> Daniel
    // TODO: Work out how to send a separate email to each follower with different content.
    const template = restaurantData.email?.templates?.[templateId] ?? null;
    if (!template) {
      throw new NotFoundException('Could not find template.');
    }

    if (!template.isApproved) {
      throw new BadRequestException('Template is not approved.');
    }

    const content = template.html;

    return this.emailSchedulingService.scheduleEmail({
      recipients,
      subject,
      content,
      date: new Date(scheduleFor).toUTCString(),
    });
  }
}
