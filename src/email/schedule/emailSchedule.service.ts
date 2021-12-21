import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { dlog } from '@tastiest-io/tastiest-utils';
import { CronJob } from 'cron';
import EmailService from '../email.service';
import EmailScheduleDto from './emailSchedule.dto';

@Injectable()
export default class EmailSchedulingService {
  constructor(
    private readonly emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  scheduleEmail(emailSchedule: EmailScheduleDto) {
    const date = new Date(emailSchedule.date);
    const job = new CronJob(date, () => {
      console.log('Sending mail!');

      dlog('emailSchedule.service ➡️ ', {
        to: emailSchedule.recipients,
        subject: emailSchedule.subject,
        text: emailSchedule.content,
      });

      // this.emailService.sendMail({
      //   to: emailSchedule.recipients,
      //   subject: emailSchedule.subject,
      //   text: emailSchedule.content,
      // });
    });

    this.schedulerRegistry.addCronJob(
      `${Date.now()}-${emailSchedule.subject}`,
      job,
    );

    job.start();

    const jobs = this.schedulerRegistry.getCronJobs();
    dlog('emailSchedule.service ➡️ jobs:', jobs);
  }

  cancelAllScheduledEmails() {
    this.schedulerRegistry.getCronJobs().forEach((job) => {
      job.stop();
    });
  }
}
