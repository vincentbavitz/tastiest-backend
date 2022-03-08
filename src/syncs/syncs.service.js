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
exports.SyncsService = void 0;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var SyncsService = /** @class */ (function () {
    /**
     * @ignore
     */
    function SyncsService(firebaseApp, configService, prisma) {
        this.firebaseApp = firebaseApp;
        this.configService = configService;
        this.prisma = prisma;
        this.cms = new tastiest_utils_1.CmsApi(this.configService.get('CONTENTFUL_SPACE_ID'), this.configService.get('CONTENTFUL_ACCESS_TOKEN'), 'production', this.configService.get('CONTENTFUL_ADMIN_TOKEN'));
    }
    SyncsService.prototype.syncSegmentEvent = function (body) {
        var _a;
        var _b;
        var documentId = (_b = body.userId) !== null && _b !== void 0 ? _b : body.anonymousId;
        var timestamp = new Date(body.timestamp).getTime();
        // Is it an existing user?
        var userExists = Boolean(body.userId);
        if (userExists && body.type === 'group') {
            // If the user exists and it's an identify event, try merging the profiles.
            null;
        }
        // Send the event to Firestore.
        // Keyed by timestamp for quick lookups.
        this.firebaseApp
            .db(tastiest_utils_1.FirestoreCollection.EVENTS)
            .doc(documentId)
            .set((_a = {},
            _a[timestamp] = __assign(__assign({}, body), { type: body.type, timestamp: timestamp }),
            _a), { merge: true });
        return { body: body };
    };
    /**
     * This function expects a webhook from the SyncsController coming from Contentful.
     * We use any Contentful update on a restaurant to sync with our database.
     */
    SyncsService.prototype.syncRestaurantFromContentful = function (body, headerSecretKey) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function () {
            var restaurantId, linkedEntries, restaurantIds;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        this.authorizeContentfulWebhook(body, headerSecretKey);
                        if (!(((_c = (_b = (_a = body.sys) === null || _a === void 0 ? void 0 : _a.contentType) === null || _b === void 0 ? void 0 : _b.sys) === null || _c === void 0 ? void 0 : _c.id) === 'restaurant')) return [3 /*break*/, 2];
                        restaurantId = (_f = (_e = (_d = body.fields) === null || _d === void 0 ? void 0 : _d.id) === null || _e === void 0 ? void 0 : _e['en-US']) !== null && _f !== void 0 ? _f : (_g = body.fields) === null || _g === void 0 ? void 0 : _g.id;
                        return [4 /*yield*/, this.nestedSyncParticularRestaurant(restaurantId)];
                    case 1:
                        _k.sent();
                        return [2 /*return*/, { synced: [restaurantId] }];
                    case 2: return [4 /*yield*/, this.contentfulFetchLinkedEntries(body.sys.type, body.sys.id)];
                    case 3:
                        linkedEntries = _k.sent();
                        restaurantIds = (_j = (_h = linkedEntries === null || linkedEntries === void 0 ? void 0 : linkedEntries.items) === null || _h === void 0 ? void 0 : _h.filter(function (item) { return item.sys.contentType.sys.id === 'restaurant'; })) === null || _j === void 0 ? void 0 : _j.map(function (item) { return item.fields.id; });
                        return [4 /*yield*/, Promise.all(restaurantIds === null || restaurantIds === void 0 ? void 0 : restaurantIds.map(this.nestedSyncParticularRestaurant))];
                    case 4:
                        _k.sent();
                        return [2 /*return*/, { synced: restaurantIds }];
                }
            });
        });
    };
    /**
     * This syncs both all experience posts and all experience products
     */
    SyncsService.prototype.syncExperienceFromContentful = function (body, headerSecretKey) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function () {
            var slug, linkedEntries, slugs;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        this.authorizeContentfulWebhook(body, headerSecretKey);
                        if (!(((_c = (_b = (_a = body.sys) === null || _a === void 0 ? void 0 : _a.contentType) === null || _b === void 0 ? void 0 : _b.sys) === null || _c === void 0 ? void 0 : _c.id) === 'post')) return [3 /*break*/, 2];
                        slug = (_f = (_e = (_d = body.fields) === null || _d === void 0 ? void 0 : _d.slug) === null || _e === void 0 ? void 0 : _e['en-US']) !== null && _f !== void 0 ? _f : (_g = body.fields) === null || _g === void 0 ? void 0 : _g.slug;
                        return [4 /*yield*/, this.nestedSyncParticularExperience(slug)];
                    case 1:
                        _k.sent();
                        return [2 /*return*/, { synced: [slug] }];
                    case 2: return [4 /*yield*/, this.contentfulFetchLinkedEntries(body.sys.type, body.sys.id)];
                    case 3:
                        linkedEntries = _k.sent();
                        slugs = (_j = (_h = linkedEntries === null || linkedEntries === void 0 ? void 0 : linkedEntries.items) === null || _h === void 0 ? void 0 : _h.filter(function (item) { return item.sys.contentType.sys.id === 'post'; })) === null || _j === void 0 ? void 0 : _j.map(function (item) { return item.fields.id; });
                        return [4 /*yield*/, Promise.all(slugs === null || slugs === void 0 ? void 0 : slugs.map(this.nestedSyncParticularExperience))];
                    case 4:
                        _k.sent();
                        return [2 /*return*/, { synced: slugs }];
                }
            });
        });
    };
    SyncsService.prototype.syncPromoCodeFromContentful = function (body) {
        null;
    };
    /**
     * We have a nested function so we can call when a restaurant syncs directly,
     * or when an embedded asset or entry that links to a restaurant changes;
     * thus we may be syncing one or more restaurants per call.
     */
    SyncsService.prototype.nestedSyncParticularRestaurant = function (restaurantId) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var restaurant, profile, updatedRestaurant;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, this.cms.getRestaurantById(restaurantId)];
                    case 1:
                        restaurant = _j.sent();
                        profile = {
                            restaurant_id: restaurantId,
                            description: restaurant.description,
                            profile_picture: restaurant.profilePicture,
                            public_phone_number: restaurant.publicPhoneNumber,
                            display_photograph: restaurant.displayPhotograph,
                            hero_illustration: restaurant.heroIllustration,
                            backdrop_still_frame: restaurant.backdropStillFrame,
                            backdrop_video: restaurant.backdropVideo,
                            website: restaurant.website,
                            meta: restaurant.meta
                        };
                        updatedRestaurant = {
                            id: restaurantId,
                            name: restaurant.name,
                            city: restaurant.city,
                            cuisine: restaurant.cuisine,
                            uri_name: restaurant.uriName,
                            location_lat: (_a = restaurant.location) === null || _a === void 0 ? void 0 : _a.lat,
                            location_lon: (_b = restaurant.location) === null || _b === void 0 ? void 0 : _b.lon,
                            location_address: (_c = restaurant.location) === null || _c === void 0 ? void 0 : _c.address,
                            location_display: (_d = restaurant.location) === null || _d === void 0 ? void 0 : _d.displayLocation,
                            location_postcode: undefined,
                            contact_first_name: (_e = restaurant.contact) === null || _e === void 0 ? void 0 : _e.firstName,
                            contact_last_name: (_f = restaurant.contact) === null || _f === void 0 ? void 0 : _f.lastName,
                            contact_email: (_g = restaurant.contact) === null || _g === void 0 ? void 0 : _g.email,
                            contact_phone_number: (_h = restaurant.contact) === null || _h === void 0 ? void 0 : _h.mobile,
                            booking_system: restaurant.bookingSystem,
                            is_demo: restaurant.isDemo,
                            is_archived: false
                        };
                        return [4 /*yield*/, this.prisma.restaurant.upsert({
                                where: { id: restaurantId },
                                update: updatedRestaurant,
                                create: updatedRestaurant
                            })];
                    case 2:
                        _j.sent();
                        // Create their corresponding profile
                        return [4 /*yield*/, this.prisma.restaurantProfile.upsert({
                                where: { restaurant_id: restaurantId },
                                update: profile,
                                create: profile
                            })];
                    case 3:
                        // Create their corresponding profile
                        _j.sent();
                        return [2 /*return*/, restaurantId];
                }
            });
        });
    };
    /**
     * We have a nested function so we can call when an experience syncs or
     * its nested entries, assets or `product` syncs, all of them will be synced
     * correctly with our database.
     */
    SyncsService.prototype.nestedSyncParticularExperience = function (slug) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var post, updatedExperiencePost, updatedExperienceProduct;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.cms.getPostBySlug(slug)];
                    case 1:
                        post = _c.sent();
                        updatedExperiencePost = {
                            id: post.id,
                            title: post.title,
                            date: new Date(post.date),
                            body: post.body,
                            city: post.city,
                            cuisine: post.cuisine,
                            description: post.description,
                            display_location: post.displayLocation,
                            plate_image: post.plate,
                            menu_image: (_a = post.menuImage) !== null && _a !== void 0 ? _a : undefined,
                            auxiliary_image: (_b = post.auxiliaryImage) !== null && _b !== void 0 ? _b : undefined,
                            see_restaurant_button: post.seeRestaurantButton,
                            meta: post.meta,
                            tags: post.tags,
                            product_id: post.product.id,
                            restaurant_id: post.product.restaurant.id,
                            slug: slug
                        };
                        updatedExperienceProduct = {
                            id: post.product.id,
                            name: post.product.name,
                            image: post.product.image,
                            allowed_heads: post.product.allowedHeads,
                            price: post.product.pricePerHeadGBP,
                            restaurant_id: post.product.restaurant.id
                        };
                        // Sync the corresponding ExperienceProduct
                        // We sync this first so that product_id is valid
                        // for new rows in the database.
                        return [4 /*yield*/, this.prisma.experienceProduct.upsert({
                                where: { id: post.product.id },
                                update: updatedExperienceProduct,
                                create: updatedExperienceProduct
                            })];
                    case 2:
                        // Sync the corresponding ExperienceProduct
                        // We sync this first so that product_id is valid
                        // for new rows in the database.
                        _c.sent();
                        return [4 /*yield*/, this.prisma.experiencePost.upsert({
                                where: { id: post.id },
                                update: updatedExperiencePost,
                                create: updatedExperiencePost
                            })];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, slug];
                }
            });
        });
    };
    /**
     * Fetches all the linked children or parents of any given entry or asset.
     * Assumed to be used with top-level entries such that the entry ID is
     * body.sys.id from the Contentful webhook.
     */
    SyncsService.prototype.contentfulFetchLinkedEntries = function (bodySysType, bodySysId) {
        return __awaiter(this, void 0, void 0, function () {
            var linkedEntries;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(bodySysType === 'Entry')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cms.client.getEntries({
                                links_to_entry: bodySysId
                            })];
                    case 1:
                        linkedEntries = _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(bodySysType === 'Asset')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cms.client.getEntries({
                                links_to_asset: bodySysId
                            })];
                    case 3:
                        linkedEntries = _a.sent();
                        return [3 /*break*/, 5];
                    case 4: throw new common_1.BadRequestException('Entity or asset is invalid.');
                    case 5: return [2 /*return*/, linkedEntries];
                }
            });
        });
    };
    SyncsService.prototype.authorizeContentfulWebhook = function (body, headerSecretKey) {
        var _a, _b, _c, _d, _e, _f, _g;
        // Authenticate with Contentful's POST secret key.
        // prettier-ignore
        if (headerSecretKey !== this.configService.get('CONTENTFUL_WEBHOOK_SECRET')) {
            throw new common_1.UnauthorizedException();
        }
        var environmentIsProduction = ((_c = (_b = (_a = body.sys) === null || _a === void 0 ? void 0 : _a.environment) === null || _b === void 0 ? void 0 : _b.sys) === null || _c === void 0 ? void 0 : _c.id) === 'master' ||
            ((_f = (_e = (_d = body.sys) === null || _d === void 0 ? void 0 : _d.environment) === null || _e === void 0 ? void 0 : _e.sys) === null || _f === void 0 ? void 0 : _f.id) === 'production';
        if (!environmentIsProduction) {
            throw new common_1.BadRequestException('Only syncing the production environment is supported');
        }
        var entityId = (_g = body.sys) === null || _g === void 0 ? void 0 : _g.id;
        if (!entityId) {
            throw new common_1.BadRequestException('Invalid entity ID');
        }
        return entityId;
    };
    SyncsService = __decorate([
        (0, common_1.Injectable)()
    ], SyncsService);
    return SyncsService;
}());
exports.SyncsService = SyncsService;
