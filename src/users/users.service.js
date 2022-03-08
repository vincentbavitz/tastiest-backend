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
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var lodash_1 = require("lodash");
var luxon_1 = require("luxon");
var user_created_event_1 = require("./events/user-created.event");
var UsersService = /** @class */ (function () {
    /**
     * @ignore
     */
    function UsersService(firebaseApp, accountService, eventEmitter, prisma) {
        this.firebaseApp = firebaseApp;
        this.accountService = accountService;
        this.eventEmitter = eventEmitter;
        this.prisma = prisma;
    }
    // FIX ME. TEMPORARY. SYNC FROM FIRESTORE
    UsersService.prototype.syncFromFirestore = function (uid) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __awaiter(this, void 0, void 0, function () {
            var userDataSnapshot, userData, userRecord, _q, userBirthdayDateTime, updatedUser, user;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0: return [4 /*yield*/, this.firebaseApp
                            .db(tastiest_utils_1.FirestoreCollection.USERS)
                            .doc(uid)
                            .get()];
                    case 1:
                        userDataSnapshot = _r.sent();
                        userData = userDataSnapshot.data();
                        _r.label = 2;
                    case 2:
                        _r.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.firebaseApp.getAuth().getUser(uid)];
                    case 3:
                        userRecord = _r.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _q = _r.sent();
                        userRecord = null;
                        return [3 /*break*/, 5];
                    case 5:
                        userBirthdayDateTime = ((_a = userData.details) === null || _a === void 0 ? void 0 : _a.birthday)
                            ? luxon_1.DateTime.fromObject({
                                year: Number(userData.details.birthday.year),
                                month: Number(userData.details.birthday.month),
                                day: Number(userData.details.birthday.day)
                            })
                            : null;
                        updatedUser = {
                            id: uid,
                            email: userData.details.email,
                            first_name: userData.details.firstName,
                            last_name: (_b = userData.details) === null || _b === void 0 ? void 0 : _b.lastName,
                            is_test_account: Boolean(userRecord === null || userRecord === void 0 ? void 0 : userRecord.customClaims['isTestAccount']),
                            mobile: (_c = userData.details.mobile) !== null && _c !== void 0 ? _c : null,
                            birthday: (userBirthdayDateTime === null || userBirthdayDateTime === void 0 ? void 0 : userBirthdayDateTime.isValid)
                                ? userBirthdayDateTime.toJSDate()
                                : undefined,
                            location_lon: (_e = (_d = userData.details) === null || _d === void 0 ? void 0 : _d.address) === null || _e === void 0 ? void 0 : _e.lon,
                            location_lat: (_g = (_f = userData.details) === null || _f === void 0 ? void 0 : _f.address) === null || _g === void 0 ? void 0 : _g.lat,
                            location_address: (_j = (_h = userData.details) === null || _h === void 0 ? void 0 : _h.address) === null || _j === void 0 ? void 0 : _j.address,
                            location_display: (_l = (_k = userData.details) === null || _k === void 0 ? void 0 : _k.address) === null || _l === void 0 ? void 0 : _l.displayLocation,
                            location_postcode: (_m = userData.details) === null || _m === void 0 ? void 0 : _m.postalCode,
                            stripe_customer_id: (_o = userData.paymentDetails) === null || _o === void 0 ? void 0 : _o.stripeCustomerId,
                            stripe_setup_secret: (_p = userData.paymentDetails) === null || _p === void 0 ? void 0 : _p.stripeSetupSecret
                        };
                        return [4 /*yield*/, this.prisma.user.findUnique({ where: { id: uid } })];
                    case 6:
                        user = _r.sent();
                        if (user) {
                            return [2 /*return*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: updatedUser
                                })];
                        }
                        return [2 /*return*/, this.prisma.user.create({
                                data: updatedUser
                            })];
                }
            });
        });
    };
    UsersService.prototype.createUser = function (_a, user) {
        var email = _a.email, password = _a.password, firstName = _a.firstName, _b = _a.isTestAccount, isTestAccount = _b === void 0 ? false : _b, anonymousId = _a.anonymousId, userAgent = _a.userAgent;
        return __awaiter(this, void 0, void 0, function () {
            var userRecord, token;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.accountService.createAccount({
                            email: email,
                            password: password,
                            firstName: firstName,
                            isTestAccount: isTestAccount,
                            role: tastiest_utils_1.UserRole.EATER
                        }, user)];
                    case 1:
                        userRecord = _c.sent();
                        return [4 /*yield*/, this.firebaseApp
                                .getAuth()
                                .createCustomToken(userRecord.uid)];
                    case 2:
                        token = _c.sent();
                        // Now we create the user in Postgres
                        return [4 /*yield*/, this.prisma.user.create({
                                data: {
                                    id: userRecord.uid,
                                    email: email,
                                    first_name: firstName,
                                    is_test_account: isTestAccount
                                }
                            })];
                    case 3:
                        // Now we create the user in Postgres
                        _c.sent();
                        // Event handles Stripe user creation and etc.
                        this.eventEmitter.emit('user.created', new user_created_event_1.UserCreatedEvent(userRecord, isTestAccount, anonymousId, userAgent, firstName));
                        // Now we return the token so the new user can sign in
                        return [2 /*return*/, { token: token }];
                }
            });
        });
    };
    UsersService.prototype.getUser = function (uid, relations) {
        if (relations === void 0) { relations = []; }
        return __awaiter(this, void 0, void 0, function () {
            var userEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                            where: { id: uid },
                            include: {
                                orders: relations.some(function (r) { return r === 'orders'; }),
                                bookings: relations.some(function (r) { return r === 'bookings'; }),
                                following: relations.some(function (r) { return r === 'following'; })
                            }
                        })];
                    case 1:
                        userEntity = _a.sent();
                        if (!userEntity) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        return [2 /*return*/, userEntity];
                }
            });
        });
    };
    UsersService.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.user.findMany({
                            orderBy: { created_at: 'desc' }
                        })];
                    case 1:
                        users = _a.sent();
                        if (users === null || users === void 0 ? void 0 : users.length) {
                            return [2 /*return*/, users];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    UsersService.prototype.updateUser = function (uid, update) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var user, updateData, updatedUser;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        console.log('users.service ➡️ update:', update);
                        return [4 /*yield*/, this.getUser(uid)];
                    case 1:
                        user = _h.sent();
                        updateData = lodash_1["default"].omitBy({
                            first_name: update.firstName,
                            last_name: update.lastName,
                            mobile: update.mobile,
                            birthday: update.birthday,
                            location_lon: (_a = update.location) === null || _a === void 0 ? void 0 : _a.lon,
                            location_lat: (_b = update.location) === null || _b === void 0 ? void 0 : _b.lat,
                            location_address: (_c = update.location) === null || _c === void 0 ? void 0 : _c.address,
                            location_display: (_d = update.location) === null || _d === void 0 ? void 0 : _d.display,
                            location_postcode: (_e = update.location) === null || _e === void 0 ? void 0 : _e.postcode,
                            stripe_customer_id: (_f = update.financial) === null || _f === void 0 ? void 0 : _f.stripeCustomerId,
                            stripe_setup_secret: (_g = update.financial) === null || _g === void 0 ? void 0 : _g.stripeSetupSecret
                        }, lodash_1["default"].isUndefined);
                        console.log('users.service ➡️ updateData:', updateData);
                        updatedUser = __assign(__assign({}, user), updateData);
                        console.log('users.service ➡️ updatedUser:', updatedUser);
                        return [2 /*return*/, this.prisma.user.update({ where: { id: uid }, data: updatedUser })];
                }
            });
        });
    };
    /**
     * INCOMPLETE!
     * Think about events for Segment and TEST every possibility.
     */
    UsersService.prototype.followRestaurant = function (restaurantId, authenticatedUser, _a) {
        var notifyNewMenu = _a.notifyNewMenu, notifyGeneralInfo = _a.notifyGeneralInfo, notifyLastMinuteTables = _a.notifyLastMinuteTables, notifyLimitedTimeDishes = _a.notifyLimitedTimeDishes, notifySpecialExperiences = _a.notifySpecialExperiences;
        return __awaiter(this, void 0, void 0, function () {
            var followRelation, newRelationData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.prisma.followRelation.findFirst({
                            where: { restaurant_id: restaurantId, user_id: authenticatedUser.uid }
                        })];
                    case 1:
                        followRelation = _b.sent();
                        newRelationData = {
                            user_id: authenticatedUser.uid,
                            restaurant_id: restaurantId,
                            followed_at: new Date(),
                            notify_new_menu: notifyNewMenu,
                            notify_general_info: notifyGeneralInfo,
                            notify_last_minute_tables: notifyLastMinuteTables,
                            notify_limited_time_dishes: notifyLimitedTimeDishes,
                            notify_special_experiences: notifySpecialExperiences
                        };
                        if (followRelation) {
                            return [2 /*return*/, this.prisma.followRelation.update({
                                    where: { id: followRelation.id },
                                    data: newRelationData
                                })];
                        }
                        return [2 /*return*/, this.prisma.followRelation.create({
                                data: newRelationData
                            })];
                }
            });
        });
    };
    UsersService = __decorate([
        (0, common_1.Injectable)()
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
