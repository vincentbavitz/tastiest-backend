"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmailModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var tracking_service_1 = require("../tracking/tracking.service");
var email_service_1 = require("./email.service");
var EmailModule = /** @class */ (function () {
    function EmailModule() {
    }
    EmailModule = __decorate([
        (0, common_1.Module)({
            imports: [config_1.ConfigModule],
            controllers: [],
            providers: [email_service_1["default"], tracking_service_1.TrackingService],
            exports: [email_service_1["default"]]
        })
    ], EmailModule);
    return EmailModule;
}());
exports.EmailModule = EmailModule;
