"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.SupportController = void 0;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var role_guard_1 = require("../auth/role.guard");
/**
 * Support functionality for users, restaurants and admin.
 *
 * Note that for all routes, the support type is implied
 * from the Bearer token.
 *
 * @example `USER_TO_SUPPORT` is when the user role is `eater`.
 * @example `SUPPORT_TO_USER` is when the user role is `admin`.
 * @example `SUPPORT_TO_RESTAURANT` is when the user role is `admin`
 * @example `RESTAURANT_TO_SUPPORT` is when the user role is `restaurant`
 */
var SupportController = /** @class */ (function () {
    function SupportController(supportService) {
        this.supportService = supportService;
    }
    SupportController.prototype.getUserTickets = function (request) {
        return this.supportService.getUserTickets(request.user);
    };
    SupportController.prototype.getRestaurantTickets = function (request) {
        return this.supportService.getRestaurantTickets(request.user);
    };
    SupportController.prototype.getUserTicket = function (id, request) {
        return this.supportService.getTicket(id, 'user', request.user);
    };
    SupportController.prototype.getRestaurantTicket = function (id, request) {
        return this.supportService.getTicket(id, 'restaurant', request.user);
    };
    SupportController.prototype.updateTicket = function (data) {
        return this.supportService.updateTicket(data);
    };
    SupportController.prototype.closeTicket = function () {
        return this.supportService.closeTicket();
    };
    SupportController.prototype.replyToUserTicket = function (replyToTicketDto, request) {
        return this.supportService.replyToTicket(replyToTicketDto.id, 'user', request.user, replyToTicketDto.message, replyToTicketDto.name);
    };
    SupportController.prototype.replyToRestaurantTicket = function (replyToTicketDto, request) {
        return this.supportService.replyToTicket(replyToTicketDto.id, 'restaurant', request.user, replyToTicketDto.message, replyToTicketDto.name);
    };
    __decorate([
        (0, common_1.Get)('users'),
        __param(0, (0, common_1.Request)())
    ], SupportController.prototype, "getUserTickets");
    __decorate([
        (0, common_1.Get)('restaurants'),
        __param(0, (0, common_1.Request)())
    ], SupportController.prototype, "getRestaurantTickets");
    __decorate([
        (0, common_1.Get)('users/ticket/:id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)())
    ], SupportController.prototype, "getUserTicket");
    __decorate([
        (0, common_1.Get)('restaurants/ticket/:id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)())
    ], SupportController.prototype, "getRestaurantTicket");
    __decorate([
        (0, common_1.Post)('updateTicket'),
        __param(0, (0, common_1.Body)())
    ], SupportController.prototype, "updateTicket");
    __decorate([
        (0, common_1.UseGuards)((0, role_guard_1["default"])(tastiest_utils_1.UserRole.ADMIN)),
        (0, common_1.Post)('closeTicket')
    ], SupportController.prototype, "closeTicket");
    __decorate([
        (0, common_1.UseGuards)((0, role_guard_1["default"])(tastiest_utils_1.UserRole.EATER)),
        (0, common_1.Post)('users/reply'),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)())
    ], SupportController.prototype, "replyToUserTicket");
    __decorate([
        (0, common_1.UseGuards)((0, role_guard_1["default"])(tastiest_utils_1.UserRole.RESTAURANT)),
        (0, common_1.Post)('restaurants/reply'),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)())
    ], SupportController.prototype, "replyToRestaurantTicket");
    SupportController = __decorate([
        (0, common_1.Controller)('support')
    ], SupportController);
    return SupportController;
}());
exports.SupportController = SupportController;
