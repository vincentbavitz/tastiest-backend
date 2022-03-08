"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.BookingsController = void 0;
var common_1 = require("@nestjs/common");
var BookingsController = /** @class */ (function () {
    function BookingsController(bookingsService) {
        this.bookingsService = bookingsService;
    }
    BookingsController.prototype.getBookings = function (getBookingsDto, request) {
        var userId = getBookingsDto.userId, restaurantId = getBookingsDto.restaurantId;
        return this.bookingsService.getBookings(request.user, userId, restaurantId);
    };
    BookingsController.prototype.getBooking = function (id, request) {
        return this.bookingsService.getBooking(id, request.user);
    };
    BookingsController.prototype.updateBooking = function (updateBookingDto, request) {
        return this.bookingsService.updateBooking(updateBookingDto.bookingId, request.user, __assign({}, updateBookingDto));
    };
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Query)()),
        __param(1, (0, common_1.Request)())
    ], BookingsController.prototype, "getBookings");
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)())
    ], BookingsController.prototype, "getBooking");
    __decorate([
        (0, common_1.Post)('update'),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)())
    ], BookingsController.prototype, "updateBooking");
    BookingsController = __decorate([
        (0, common_1.Controller)('bookings')
    ], BookingsController);
    return BookingsController;
}());
exports.BookingsController = BookingsController;
