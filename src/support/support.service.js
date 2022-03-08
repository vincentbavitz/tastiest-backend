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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.SupportService = void 0;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var lodash_1 = require("lodash");
/**
 * REPLACE THIS SERVICE WITH A SAAS PRODUCT.
 * DO NOT RE-INVENT THE WHEEL.
 */
var SupportService = /** @class */ (function () {
    /**
     * @ignore
     */
    function SupportService(firebaseApp, trackingService) {
        this.firebaseApp = firebaseApp;
        this.trackingService = trackingService;
    }
    SupportService.prototype.getUserTickets = function (user, limit, skip) {
        if (limit === void 0) { limit = 100; }
        if (skip === void 0) { skip = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var ticketsSnapshot, tickets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!user.roles.includes(tastiest_utils_1.UserRole.ADMIN)) {
                            throw new common_1.ForbiddenException();
                        }
                        return [4 /*yield*/, this.firebaseApp
                                .db(tastiest_utils_1.FirestoreCollection.SUPPORT_USERS)
                                .limit(limit)
                                .offset(skip)
                                .get()];
                    case 1:
                        ticketsSnapshot = _a.sent();
                        if (ticketsSnapshot.empty) {
                            return [2 /*return*/, []];
                        }
                        tickets = [];
                        ticketsSnapshot.forEach(function (ticket) {
                            return tickets.push(ticket.data());
                        });
                        return [2 /*return*/, tickets];
                }
            });
        });
    };
    SupportService.prototype.getRestaurantTickets = function (user, limit, skip) {
        if (limit === void 0) { limit = 100; }
        if (skip === void 0) { skip = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var ticketsSnapshot, tickets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!user.roles.includes(tastiest_utils_1.UserRole.ADMIN)) {
                            throw new common_1.ForbiddenException();
                        }
                        return [4 /*yield*/, this.firebaseApp
                                .db(tastiest_utils_1.FirestoreCollection.SUPPORT_RESTAURANTS)
                                .limit(limit)
                                .offset(skip)
                                .get()];
                    case 1:
                        ticketsSnapshot = _a.sent();
                        if (ticketsSnapshot.empty) {
                            return [2 /*return*/, []];
                        }
                        tickets = [];
                        ticketsSnapshot.forEach(function (ticket) {
                            return tickets.push(ticket.data());
                        });
                        return [2 /*return*/, tickets];
                }
            });
        });
    };
    SupportService.prototype.getTicket = function (id, type, user) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, ticketSnapshot, ticket, sortedConversation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = type === 'user'
                            ? tastiest_utils_1.FirestoreCollection.SUPPORT_USERS
                            : tastiest_utils_1.FirestoreCollection.SUPPORT_RESTAURANTS;
                        return [4 /*yield*/, this.firebaseApp.db(collection).doc(id).get()];
                    case 1:
                        ticketSnapshot = _a.sent();
                        // Does the ticket exist?
                        if (!ticketSnapshot.exists) {
                            throw new common_1.NotFoundException("Ticket with the given ID doesn't exist.");
                        }
                        ticket = ticketSnapshot.data();
                        // Ensure the request is coming from the owner of the ticket or an admin.
                        if (!this.validateTicketOwnership(user, ticket)) {
                            throw new common_1.ForbiddenException();
                        }
                        sortedConversation = ticket.conversation.sort(function (a, b) { return b.timestamp - a.timestamp; });
                        return [2 /*return*/, __assign(__assign({}, ticket), { conversation: sortedConversation })];
                }
            });
        });
    };
    SupportService.prototype.updateTicket = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var ref, originalSnapshot, original, updated, ticket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ref = this.firebaseApp
                            .db(tastiest_utils_1.FirestoreCollection.SUPPORT_USERS)
                            .doc(data.ticketId);
                        return [4 /*yield*/, ref.get()];
                    case 1:
                        originalSnapshot = _a.sent();
                        original = originalSnapshot.data();
                        updated = __assign({}, original);
                        if (data.priority !== undefined)
                            updated.priority = data.priority;
                        if (data.resolved !== undefined)
                            updated.resolved = data.resolved;
                        if (data.type !== undefined)
                            updated.type = data.type;
                        // Have we actually changed anything?
                        // If not, just return.
                        if ((0, lodash_1.isEqual)(original, updated)) {
                            console.log('Nothing changed');
                            return [2 /*return*/, { message: 'critical' }];
                        }
                        ticket = __assign(__assign(__assign({}, original), updated), { updatedAt: Date.now() });
                        return [4 /*yield*/, ref.set(ticket, { merge: true })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SupportService.prototype.replyToTicket = function (id, type, user, message, name) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket, direction, reply, collection, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTicket(id, type, user)];
                    case 1:
                        ticket = _a.sent();
                        // Does this belong to the requester?
                        if (!this.validateTicketOwnership(user, ticket)) {
                            throw new common_1.ForbiddenException();
                        }
                        direction = user.roles.includes(tastiest_utils_1.UserRole.ADMIN)
                            ? tastiest_utils_1.SupportMessageDirection["SUPPORT_TO_".concat(type.toUpperCase())]
                            : tastiest_utils_1.SupportMessageDirection["".concat(type.toUpperCase(), "_TO_SUPPORT")];
                        reply = {
                            name: name,
                            message: message,
                            direction: direction,
                            timestamp: Date.now(),
                            recipientHasOpened: false,
                            hasOpened: false
                        };
                        collection = type === 'user'
                            ? tastiest_utils_1.FirestoreCollection.SUPPORT_USERS
                            : tastiest_utils_1.FirestoreCollection.SUPPORT_RESTAURANTS;
                        updated = __assign({}, ticket);
                        // Mark all previous messages as read.
                        updated.conversation = ticket.conversation.map(function (message) { return (__assign(__assign({}, message), { recipientHasOpened: true })); });
                        // Add reply to conversation
                        updated.conversation = __spreadArray(__spreadArray([], ticket.conversation, true), [reply], false);
                        updated.updatedAt = Date.now();
                        // Send reply to Segment
                        // Send reply to Segment
                        return [4 /*yield*/, this.trackingService.track('Reply to Restaurant Support Ticket', {
                                userId: user.uid
                            }, ticket)];
                    case 2:
                        // Send reply to Segment
                        // Send reply to Segment
                        _a.sent();
                        return [4 /*yield*/, this.firebaseApp.db(collection).doc(id).set(updated, { merge: true })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, reply];
                }
            });
        });
    };
    SupportService.prototype.closeTicket = function () {
        return null;
    };
    /**
     * Validate that the request is coming from the owner of the ticket or an admin.
     */
    SupportService.prototype.validateTicketOwnership = function (user, ticket) {
        var _a;
        if (user.roles.includes(tastiest_utils_1.UserRole.ADMIN)) {
            return true;
        }
        var uid = (_a = ticket.userId) !== null && _a !== void 0 ? _a : ticket.restaurantId;
        return uid === user.uid;
    };
    SupportService = __decorate([
        (0, common_1.Injectable)()
    ], SupportService);
    return SupportService;
}());
exports.SupportService = SupportService;
