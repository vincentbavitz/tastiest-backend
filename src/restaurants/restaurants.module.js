"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RestaurantsModule = void 0;
var common_1 = require("@nestjs/common");
var email_service_1 = require("../email/email.service");
var email_schedule_service_1 = require("../email/schedule/email-schedule.service");
var prisma_service_1 = require("../prisma/prisma.service");
var tracking_service_1 = require("../tracking/tracking.service");
var users_module_1 = require("../users/users.module");
var restaurants_controller_1 = require("./restaurants.controller");
var restaurants_service_1 = require("./restaurants.service");
var RestaurantsModule = /** @class */ (function () {
    function RestaurantsModule() {
    }
    RestaurantsModule = __decorate([
        (0, common_1.Module)({
            imports: [users_module_1.UsersModule],
            controllers: [restaurants_controller_1.RestaurantsController],
            providers: [
                prisma_service_1.PrismaService,
                restaurants_service_1.RestaurantsService,
                tracking_service_1.TrackingService,
                email_service_1["default"],
                email_schedule_service_1["default"],
            ],
            exports: [restaurants_service_1.RestaurantsService]
        })
    ], RestaurantsModule);
    return RestaurantsModule;
}());
exports.RestaurantsModule = RestaurantsModule;
