"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var cron_1 = require("cron");
var EmailSchedulingService = /** @class */ (function () {
    /**
     * @ignore
     */
    function EmailSchedulingService(emailService, schedulerRegistry) {
        this.emailService = emailService;
        this.schedulerRegistry = schedulerRegistry;
    }
    EmailSchedulingService.prototype.scheduleEmail = function (emailSchedule) {
        var date = new Date(emailSchedule.date);
        var job = new cron_1.CronJob(date, function () {
            console.log('Sending mail!');
            (0, tastiest_utils_1.dlog)('emailSchedule.service ➡️ ', {
                to: emailSchedule.recipients,
                subject: emailSchedule.subject,
                text: emailSchedule.content
            });
            // this.emailService.sendMail({
            //   to: emailSchedule.recipients,
            //   subject: emailSchedule.subject,
            //   text: emailSchedule.content,
            // });
        });
        this.schedulerRegistry.addCronJob("".concat(Date.now(), "-").concat(emailSchedule.subject), job);
        job.start();
        var jobs = this.schedulerRegistry.getCronJobs();
        (0, tastiest_utils_1.dlog)('emailSchedule.service ➡️ jobs:', jobs);
    };
    EmailSchedulingService.prototype.cancelAllScheduledEmails = function () {
        this.schedulerRegistry.getCronJobs().forEach(function (job) {
            job.stop();
        });
    };
    EmailSchedulingService = __decorate([
        (0, common_1.Injectable)()
    ], EmailSchedulingService);
    return EmailSchedulingService;
}());
exports["default"] = EmailSchedulingService;
