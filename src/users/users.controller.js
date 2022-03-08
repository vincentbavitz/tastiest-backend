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
exports.UsersController = void 0;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var role_guard_1 = require("../auth/role.guard");
/**
 * NOTE. Users in this context refers only to eaters.
 * That means users who are using Tastiest as customers only.
 * If you are looking for restaurant accounts, look into AccountService.
 */
var UsersController = /** @class */ (function () {
    function UsersController(userService) {
        this.userService = userService;
    }
    /**
     * Strictly gets eaters profiles.
     * Does not get profiles of restaurant users or ad6mins.
     */
    UsersController.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.userService.getUsers()];
            });
        });
    };
    /**
     * Get the user of the token making the request.
     * NOTE! This must come before @Get(':uid')
     * otherwise the dyanmic route will catch it.
     */
    UsersController.prototype.getUserFromToken = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.userService.getUser(request.user.uid)];
            });
        });
    };
    /**
     * Update a user record.
     * NOTE! This must come sequentially before @Get(':uid') in
     * the class otherwise the dyanmic route will catch it.
     */
    UsersController.prototype.updateUser = function (updateUserDto, request) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isAdmin(request) && updateUserDto.uid !== request.user.uid) {
                            throw new common_1.ForbiddenException();
                        }
                        // Only admins can modify financial data.
                        if (!this.isAdmin(request) && updateUserDto.financial) {
                            throw new common_1.ForbiddenException('Unauthorized');
                        }
                        return [4 /*yield*/, this.userService.updateUser(updateUserDto.uid, updateUserDto)];
                    case 1:
                        updated = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, updated), { 
                                // Only Admins may view these properties
                                id: this.isAdmin(request) ? updated.id : undefined, stripe_setup_secret: this.isAdmin(request)
                                    ? updated.stripe_setup_secret
                                    : undefined, stripe_customer_id: this.isAdmin(request)
                                    ? updated.stripe_customer_id
                                    : undefined })];
                }
            });
        });
    };
    /**
     * Follow a restaurant and optionally set notifications.
     */
    UsersController.prototype.FollowRestaurant = function (followRestaurantDto, request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.userService.followRestaurant(followRestaurantDto.restaurantId, request.user, __assign({ notifyNewMenu: true, notifyGeneralInfo: true, notifyLastMinuteTables: true, notifyLimitedTimeDishes: true, notifySpecialExperiences: true }, followRestaurantDto))];
            });
        });
    };
    /**
     * Unfollow a restaurant completely
     */
    UsersController.prototype.UnfollowRestaurant = function (unfollowRestaurantDto, request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null];
            });
        });
    };
    /**
     * Get a single user.
     */
    UsersController.prototype.getUser = function (uid, request) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isAdmin(request) && uid !== request.user.uid) {
                            throw new common_1.ForbiddenException();
                        }
                        return [4 /*yield*/, this.userService.getUser(uid)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, user), { 
                                // The following properties are only visible to Admins.
                                stripe_setup_secret: this.isAdmin(request)
                                    ? user.stripe_setup_secret
                                    : undefined, stripe_customer_id: this.isAdmin(request)
                                    ? user.stripe_customer_id
                                    : undefined })];
                }
            });
        });
    };
    UsersController.prototype.isAdmin = function (request) {
        return request.user.roles.includes(tastiest_utils_1.UserRole.ADMIN);
    };
    __decorate([
        (0, common_1.Get)(),
        (0, common_1.UseGuards)((0, role_guard_1["default"])(tastiest_utils_1.UserRole.ADMIN))
    ], UsersController.prototype, "getUsers");
    __decorate([
        (0, common_1.Get)('me'),
        __param(0, (0, common_1.Request)())
    ], UsersController.prototype, "getUserFromToken");
    __decorate([
        (0, common_1.Post)('update'),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)())
    ], UsersController.prototype, "updateUser");
    __decorate([
        (0, common_1.Post)('follow-restaurant'),
        (0, common_1.UseGuards)((0, role_guard_1["default"])(tastiest_utils_1.UserRole.EATER)),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)())
    ], UsersController.prototype, "FollowRestaurant");
    __decorate([
        (0, common_1.Post)('unfollow-restaurant'),
        (0, common_1.UseGuards)((0, role_guard_1["default"])(tastiest_utils_1.UserRole.EATER)),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)())
    ], UsersController.prototype, "UnfollowRestaurant");
    __decorate([
        (0, common_1.Get)(':uid'),
        (0, common_1.UseGuards)((0, role_guard_1["default"])(tastiest_utils_1.UserRole.EATER)),
        __param(0, (0, common_1.Param)('uid')),
        __param(1, (0, common_1.Request)())
    ], UsersController.prototype, "getUser");
    UsersController = __decorate([
        (0, common_1.Controller)('users')
    ], UsersController);
    return UsersController;
}());
exports.UsersController = UsersController;
