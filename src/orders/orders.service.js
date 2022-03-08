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
exports.OrdersService = void 0;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var order_created_event_1 = require("./events/order-created.event");
var OrdersService = /** @class */ (function () {
    /**
     * @ignore
     */
    function OrdersService(eventEmitter, prisma) {
        this.eventEmitter = eventEmitter;
        this.prisma = prisma;
    }
    /**
     * Order is created only after the user signs in from the checkout page.
     * This ensures we have a valid user ID.
     */
    OrdersService.prototype.createOrder = function (experienceProductId, uid, heads, bookedForTimestamp, _a) {
        var promoCode = _a.promoCode, userAgent = _a.userAgent, _b = _a.isTest, isTest = _b === void 0 ? true : _b;
        return __awaiter(this, void 0, void 0, function () {
            var experiencePost, subtotal, priceAfterPromo, _c, final, fees, order;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.prisma.experiencePost.findUnique({
                            where: { product_id: experienceProductId },
                            include: { product: true, restaurant: true }
                        })];
                    case 1:
                        experiencePost = _d.sent();
                        if (!experiencePost) {
                            throw new common_1.NotFoundException('Experience does not exist');
                        }
                        subtotal = experiencePost.product.price * heads;
                        priceAfterPromo = this.calculatePromoPrice(subtotal, 'promo');
                        _c = this.calculatePaymentFees(priceAfterPromo), final = _c.total, fees = _c.fees;
                        return [4 /*yield*/, this.prisma.order.create({
                                data: {
                                    user_id: uid,
                                    restaurant_id: experiencePost.restaurant.id,
                                    user_facing_id: this.generateUserFacingId(),
                                    heads: Math.floor(heads),
                                    price: {
                                        subtotal: subtotal,
                                        fees: fees,
                                        final: final,
                                        currency: 'GBP'
                                    },
                                    product: experiencePost.product,
                                    booked_for: new Date(bookedForTimestamp),
                                    from_slug: experiencePost.slug,
                                    is_user_following: false,
                                    is_test: isTest
                                }
                            })];
                    case 2:
                        order = _d.sent();
                        // Event handles Stripe user creation and etc.
                        this.eventEmitter.emit('order.created', new order_created_event_1.OrderCreatedEvent(order, userAgent));
                        return [2 /*return*/, this.prisma.order.findUnique({
                                where: { token: order.token },
                                include: { restaurant: true }
                            })];
                }
            });
        });
    };
    OrdersService.prototype.getOrder = function (token, requestUser) {
        return __awaiter(this, void 0, void 0, function () {
            var order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.order.findUnique({
                            where: { token: token },
                            include: { restaurant: true }
                        })];
                    case 1:
                        order = _a.sent();
                        if (!order) {
                            throw new common_1.NotFoundException();
                        }
                        // Only admins and verified users can access the order.
                        if (!requestUser.roles.includes(tastiest_utils_1.UserRole.ADMIN) &&
                            order.user_id !== requestUser.uid) {
                            throw new common_1.UnauthorizedException("This order doesn't belong to you.");
                        }
                        return [2 /*return*/, order];
                }
            });
        });
    };
    /**
     * Calculate price after applying promocode.
     */
    OrdersService.prototype.calculatePromoPrice = function (price, promo) {
        var _a, _b, _c, _d;
        if (!promo || !((_a = promo.discount) === null || _a === void 0 ? void 0 : _a.value)) {
            return price;
        }
        var isPercentage = ((_b = promo === null || promo === void 0 ? void 0 : promo.discount) === null || _b === void 0 ? void 0 : _b.unit) === '%';
        if (isPercentage) {
            var discountGbp = price * (1 - Math.min(promo.discount.value, 100) / 100);
            return discountGbp;
        }
        return Math.max(0, (_d = price - ((_c = promo === null || promo === void 0 ? void 0 : promo.discount) === null || _c === void 0 ? void 0 : _c.value)) !== null && _d !== void 0 ? _d : 0);
    };
    /**
     * Calculate the payment processing fees to pass them onto the payer.
     * Fees taken from https://stripe.com/gb/pricing under non-European cards.
     *
     * We take the higher-fee structure because we can't predict in advance the card
     * being used when calculating the fees.
     *
     * We also take an extra 10p above the maximum card fee from Stripe (20 + 10 = 30p) to ensure that
     * internal transfers to Connect Accounts always succeeds (for when restaurant takes 100%).
     *
     * Assumes that all values are in GBP and that the given price parameter is
     * the price after promos, discounts and etc.
     */
    OrdersService.prototype.calculatePaymentFees = function (price) {
        // 2.9 % + 0.30
        var PAYMENT_FEE_PERCENTAGE = 0.029;
        var PAYMENT_FEE_FLAT_RATE = 0.3;
        var fees = price * PAYMENT_FEE_PERCENTAGE + PAYMENT_FEE_FLAT_RATE;
        return {
            total: Number((price + fees).toFixed(2)),
            fees: Number(fees.toFixed(2))
        };
    };
    /**
     * Generate user facing IDs.
     * For orders, bookings, products, etc.
     */
    OrdersService.prototype.generateUserFacingId = function (length) {
        if (length === void 0) { length = 9; }
        return Array(length)
            .fill(undefined)
            .map(function (_) { return String(Math.floor(Math.random() * 10)); })
            .join('');
    };
    OrdersService = __decorate([
        (0, common_1.Injectable)()
    ], OrdersService);
    return OrdersService;
}());
exports.OrdersService = OrdersService;
