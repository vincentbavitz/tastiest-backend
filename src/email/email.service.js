"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var common_1 = require("@nestjs/common");
var nodemailer_1 = require("nodemailer");
var EmailService = /** @class */ (function () {
    /**
     * @ignore
     */
    function EmailService(configService) {
        this.configService = configService;
        this.nodemailerTransport = (0, nodemailer_1.createTransport)({
            service: configService.get('EMAIL_SERVICE'),
            auth: {
                user: configService.get('EMAIL_USER'),
                pass: configService.get('EMAIL_PASSWORD')
            }
        });
    }
    EmailService.prototype.sendMail = function (options) {
        return this.nodemailerTransport.sendMail(options);
    };
    EmailService = __decorate([
        (0, common_1.Injectable)()
    ], EmailService);
    return EmailService;
}());
exports["default"] = EmailService;
