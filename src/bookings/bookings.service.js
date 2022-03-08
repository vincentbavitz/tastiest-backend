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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.BookingsService = void 0;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var luxon_1 = require("luxon");
var BookingsService = /** @class */ (function () {
    /**
     * @ignore
     */
    function BookingsService(firebaseApp, trackingService) {
        this.firebaseApp = firebaseApp;
        this.trackingService = trackingService;
    }
    BookingsService.prototype.getBookings = function (user, userId, restaurantId) {
        return __awaiter(this, void 0, void 0, function () {
            var bookingsSnapshot, bookings_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Only admins can get all bookings
                        if (!userId && !restaurantId && !user.roles.includes(tastiest_utils_1.UserRole.ADMIN)) {
                            throw new common_1.ForbiddenException();
                        }
                        if (!user.roles.includes(tastiest_utils_1.UserRole.ADMIN)) return [3 /*break*/, 2];
                        if (userId) {
                            return [2 /*return*/, this.getBookingsOfUser(userId, restaurantId)];
                        }
                        if (restaurantId) {
                            return [2 /*return*/, this.getBookingsOfRestaurant(restaurantId)];
                        }
                        return [4 /*yield*/, this.firebaseApp
                                .db(tastiest_utils_1.FirestoreCollection.BOOKINGS)
                                .get()];
                    case 1:
                        bookingsSnapshot = _a.sent();
                        bookings_1 = [];
                        bookingsSnapshot.forEach(function (booking) {
                            return bookings_1.push(booking.data());
                        });
                        return [2 /*return*/, bookings_1];
                    case 2:
                        // If user, ensure they have the permissions to view.
                        if (user.roles.includes(tastiest_utils_1.UserRole.EATER)) {
                            if (userId !== user.uid) {
                                throw new common_1.ForbiddenException();
                            }
                            return [2 /*return*/, this.getBookingsOfUser(userId, restaurantId)];
                        }
                        // If restaurant, ensure they own it.
                        if (user.roles.includes(tastiest_utils_1.UserRole.RESTAURANT)) {
                            if (restaurantId !== user.uid) {
                                throw new common_1.ForbiddenException();
                            }
                            // Get bookings of this restaurant only from this user.
                            if (userId) {
                                return [2 /*return*/, this.getBookingsOfUser(userId, restaurantId)];
                            }
                            return [2 /*return*/, this.getBookingsOfRestaurant(restaurantId)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get booking with the corresponding ID.
     * NB. The booking ID is equivalent to the corresponding order ID.
     */
    BookingsService.prototype.getBooking = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            var bookingSnapshot, booking;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.firebaseApp
                            .db(tastiest_utils_1.FirestoreCollection.BOOKINGS)
                            .doc(id)
                            .get()];
                    case 1:
                        bookingSnapshot = _a.sent();
                        // Does the booking exist?
                        if (!bookingSnapshot.exists) {
                            throw new common_1.NotFoundException("Booking with the given ID doesn't exist.");
                        }
                        booking = bookingSnapshot.data();
                        // Ensure the request is coming from the owner of the ticket or an admin.
                        if (!this.validateBookingOwnership(user, booking)) {
                            throw new common_1.ForbiddenException();
                        }
                        return [2 /*return*/, booking];
                }
            });
        });
    };
    BookingsService.prototype.getBookingsOfUser = function (uid, fromRestaurantId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, bookingsSnapshot, bookings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = fromRestaurantId
                            ? this.firebaseApp
                                .db(tastiest_utils_1.FirestoreCollection.BOOKINGS)
                                .where('userId', '==', uid)
                                .where('restaurantId', '==', fromRestaurantId)
                            : this.firebaseApp
                                .db(tastiest_utils_1.FirestoreCollection.BOOKINGS)
                                .where('userId', '==', uid);
                        return [4 /*yield*/, query.get()];
                    case 1:
                        bookingsSnapshot = _a.sent();
                        bookings = [];
                        bookingsSnapshot.forEach(function (booking) {
                            return bookings.push(booking.data());
                        });
                        return [2 /*return*/, bookings];
                }
            });
        });
    };
    BookingsService.prototype.getBookingsOfRestaurant = function (restaurantId) {
        return __awaiter(this, void 0, void 0, function () {
            var bookingsSnapshot, bookings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.firebaseApp
                            .db(tastiest_utils_1.FirestoreCollection.BOOKINGS)
                            .where('restaurantId', '==', restaurantId)
                            .get()];
                    case 1:
                        bookingsSnapshot = _a.sent();
                        bookings = [];
                        bookingsSnapshot.forEach(function (booking) {
                            return bookings.push(booking.data());
                        });
                        return [2 /*return*/, bookings];
                }
            });
        });
    };
    /**
     * Update the values `hasArrived`, `hasCancelled` or `bookedForTimestamp` on a booking.
     * Note that only admins...
     * 1. may modify `hasArrived` when `hasCancelled` is true
     * 2. may modify `hasCancelled` when `hasArrived` is true
     * 3. may modify `bookedForTimestamp` when `hasCancelled` or `hasArrived` is true.
     * 4. may set `bookedForTimestamp` to a date that is in the past.
     */
    BookingsService.prototype.updateBooking = function (bookingId, user, _a) {
        var hasArrived = _a.hasArrived, hasCancelled = _a.hasCancelled, bookedForTimestamp = _a.bookedForTimestamp;
        return __awaiter(this, void 0, void 0, function () {
            var booking, updatedBooking;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (hasArrived === undefined &&
                            hasCancelled === undefined &&
                            bookedForTimestamp === undefined) {
                            throw new common_1.BadRequestException('Nothing to update. Please provide at least one update parameter.');
                        }
                        return [4 /*yield*/, this.getBooking(bookingId, user)];
                    case 1:
                        booking = _b.sent();
                        updatedBooking = __assign({}, booking);
                        // Can't modify if they've arrived or cancelled.
                        // Admins can override this.
                        if (!user.roles.includes(tastiest_utils_1.UserRole.ADMIN) &&
                            (booking.hasArrived || booking.hasCancelled)) {
                            throw new common_1.BadRequestException('Booking can not be modified after the customer has arrived or the booking has been cancelled.');
                        }
                        // Is the new booking timestamp valid?
                        if (bookedForTimestamp) {
                            // Admins are allowed to set bookings in the past.
                            if (!user.roles.includes(tastiest_utils_1.UserRole.ADMIN) &&
                                bookedForTimestamp < Date.now()) {
                                throw new common_1.NotAcceptableException('Can not set `bookedForTimestamp` to a date in the past.');
                            }
                            // prettier-ignore
                            updatedBooking.bookedForHumanDate = luxon_1.DateTime.fromMillis(bookedForTimestamp, { zone: tastiest_utils_1.TIME.LOCALES.LONDON }).toFormat('hh:mm a, DDD');
                            updatedBooking.bookedForTimestamp = bookedForTimestamp;
                        }
                        if (!(hasArrived !== undefined && hasArrived !== booking.hasArrived)) return [3 /*break*/, 3];
                        updatedBooking.hasArrived = hasArrived;
                        if (!updatedBooking.hasArrived) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.trackingService.track('Eater Arrived', { userId: booking.userId }, {
                                email: booking.eaterEmail,
                                bookingId: booking.orderId,
                                restaurant: booking.restaurant,
                                customerUserId: booking.userId,
                                booking: updatedBooking
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!(hasCancelled !== undefined && hasCancelled !== booking.hasCancelled)) return [3 /*break*/, 5];
                        updatedBooking.hasCancelled = hasCancelled;
                        if (!updatedBooking.hasCancelled) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.trackingService.track('Booking Cancelled', {
                                userId: user.uid
                            }, {
                                email: booking.eaterEmail,
                                bookingId: booking.orderId,
                                restaurant: booking.restaurant,
                                customerUserId: booking.userId,
                                booking: updatedBooking
                            })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: 
                    // Update booking in Firestore
                    return [4 /*yield*/, this.firebaseApp.db(tastiest_utils_1.FirestoreCollection.BOOKINGS).doc(bookingId).set({
                            hasArrived: updatedBooking.hasArrived,
                            hasCancelled: updatedBooking.hasCancelled,
                            bookedForTimestamp: updatedBooking.bookedForTimestamp,
                            bookedForHumanDate: updatedBooking.bookedForHumanDate
                        }, { merge: true })];
                    case 6:
                        // Update booking in Firestore
                        _b.sent();
                        if (!(bookedForTimestamp &&
                            bookedForTimestamp !== booking.bookedForTimestamp)) return [3 /*break*/, 9];
                        // Track update in Segment
                        return [4 /*yield*/, this.trackingService.track('Booking Date Updated', { userId: user.uid }, __assign({ email: booking.eaterEmail, bookingId: booking.orderId, restaurant: booking.restaurant, customerUserId: booking.userId, before: {
                                    hasArrived: booking.hasArrived,
                                    hasCancelled: booking.hasCancelled,
                                    bookedForTimestamp: booking.bookedForTimestamp,
                                    bookedForHumanDate: booking.bookedForHumanDate
                                }, after: {
                                    hasArrived: updatedBooking.hasArrived,
                                    hasCancelled: updatedBooking.hasCancelled,
                                    bookedForTimestamp: updatedBooking.bookedForTimestamp,
                                    bookedForHumanDate: updatedBooking.bookedForHumanDate
                                } }, updatedBooking))];
                    case 7:
                        // Track update in Segment
                        _b.sent();
                        return [4 /*yield*/, this.firebaseApp
                                .db(tastiest_utils_1.FirestoreCollection.ORDERS)
                                .doc(bookingId)
                                .set({ bookedForTimestamp: bookedForTimestamp }, { merge: true })];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [2 /*return*/, {
                            bookingId: bookingId,
                            hasArrived: updatedBooking.hasArrived,
                            hasCancelled: updatedBooking.hasCancelled,
                            bookedForTimestamp: updatedBooking.bookedForTimestamp,
                            bookedForHumanDate: updatedBooking.bookedForHumanDate
                        }];
                }
            });
        });
    };
    //   async updateTicket(data: UpdateUserTicketDto) {
    //     const ref = this.firebaseApp
    //       .db(FirestoreCollection.SUPPORT_USERS)
    //       .doc(data.ticketId);
    //     const originalSnapshot = await ref.get();
    //     const original = originalSnapshot.data() as UserSupportRequest;
    //     // Updated file
    //     const updated = { ...original };
    //     if (data.priority !== undefined) updated.priority = data.priority;
    //     if (data.resolved !== undefined) updated.resolved = data.resolved;
    //     if (data.type !== undefined) updated.type = data.type;
    //     // Have we actually changed anything?
    //     // If not, just return.
    //     if (isEqual(original, updated)) {
    //       console.log('Nothing changed');
    //       return { message: 'critical' };
    //     }
    //     // Save new to Firestore
    //     const ticket: UserSupportRequest = {
    //       ...original,
    //       ...updated,
    //       updatedAt: Date.now(),
    //     };
    //     await ref.set(ticket, { merge: true });
    //   }
    /**
     * Validate that the request is coming from the owner
     * of the booking, the corresponding restaurant or an admin.
     */
    BookingsService.prototype.validateBookingOwnership = function (user, booking) {
        // Admins can view all bookings.
        if (user.roles.includes(tastiest_utils_1.UserRole.ADMIN)) {
            return true;
        }
        // Does it belong to the user?
        if (user.roles.includes(tastiest_utils_1.UserRole.EATER)) {
            return booking.userId === user.uid;
        }
        // Does it belong to the restaurant?
        if (user.roles.includes(tastiest_utils_1.UserRole.RESTAURANT)) {
            return booking.restaurantId === user.uid;
        }
        return false;
    };
    /**
     * Confirmation code required for user to show restaurant
     */
    BookingsService.prototype.generateConfirmationCode = function () {
        // Random number between 1 and 9
        var randomDigit = function () { return Math.floor(Math.random() * 10); };
        return Array(4)
            .fill(null)
            .map(function (_) { return String(randomDigit()); })
            .join('');
    };
    BookingsService = __decorate([
        (0, common_1.Injectable)()
    ], BookingsService);
    return BookingsService;
}());
exports.BookingsService = BookingsService;
