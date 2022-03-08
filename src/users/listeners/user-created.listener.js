"use strict";
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
exports.UserCreatedListener = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var stripe_1 = require("stripe");
var UserCreatedListener = /** @class */ (function () {
    function UserCreatedListener(configService, usersService, trackingService) {
        this.configService = configService;
        this.usersService = usersService;
        this.trackingService = trackingService;
    }
    UserCreatedListener.prototype.handleUserCreatedEvent = function (event) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var STRIPE_SECRET_KEY, stripe, customer, intent;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        STRIPE_SECRET_KEY = event.isTestAccount
                            ? this.configService.get('STRIPE_TEST_SECRET_KEY')
                            : this.configService.get('STRIPE_LIVE_SECRET_KEY');
                        stripe = new stripe_1["default"](STRIPE_SECRET_KEY, {
                            apiVersion: '2020-08-27'
                        });
                        return [4 /*yield*/, stripe.customers.create({
                                email: event.userRecord.email
                            })];
                    case 1:
                        customer = _e.sent();
                        return [4 /*yield*/, stripe.setupIntents.create({
                                customer: customer.id
                            })];
                    case 2:
                        intent = _e.sent();
                        // Save to the new users database entry.
                        return [4 /*yield*/, this.usersService.updateUser(event.userRecord.uid, {
                                financial: {
                                    stripeCustomerId: (_a = customer.id) !== null && _a !== void 0 ? _a : null,
                                    stripeSetupSecret: (_b = intent.client_secret) !== null && _b !== void 0 ? _b : null
                                }
                            })];
                    case 3:
                        // Save to the new users database entry.
                        _e.sent();
                        // Track User Created
                        if (event.anonymousId) {
                            this.trackingService.identify({ anonymousId: event.anonymousId }, {
                                userId: event.userRecord.uid,
                                email: event.userRecord.email,
                                firstName: event.firstName
                            }, { userAgent: (_c = event.userAgent) !== null && _c !== void 0 ? _c : null });
                        }
                        // No need to await tracking after we've identified them
                        this.trackingService.track('User Signed Up', { userId: event.userRecord.uid }, {
                            role: tastiest_utils_1.UserRole.EATER,
                            name: event.firstName,
                            email: event.userRecord.email
                        }, { userAgent: (_d = event.userAgent) !== null && _d !== void 0 ? _d : null });
                        console.log('event', event);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, event_emitter_1.OnEvent)('user.created')
    ], UserCreatedListener.prototype, "handleUserCreatedEvent");
    UserCreatedListener = __decorate([
        (0, common_1.Injectable)()
    ], UserCreatedListener);
    return UserCreatedListener;
}());
exports.UserCreatedListener = UserCreatedListener;
