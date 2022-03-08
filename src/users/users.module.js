"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsersModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var account_service_1 = require("../admin/account/account.service");
var prisma_service_1 = require("../prisma/prisma.service");
var tracking_service_1 = require("../tracking/tracking.service");
var user_created_listener_1 = require("./listeners/user-created.listener");
var users_controller_1 = require("./users.controller");
var users_service_1 = require("./users.service");
var UsersModule = /** @class */ (function () {
    function UsersModule() {
    }
    UsersModule = __decorate([
        (0, common_1.Module)({
            controllers: [users_controller_1.UsersController],
            providers: [
                users_service_1.UsersService,
                config_1.ConfigService,
                prisma_service_1.PrismaService,
                tracking_service_1.TrackingService,
                account_service_1.AccountService,
                user_created_listener_1.UserCreatedListener,
            ],
            exports: [users_service_1.UsersService]
        })
    ], UsersModule);
    return UsersModule;
}());
exports.UsersModule = UsersModule;
