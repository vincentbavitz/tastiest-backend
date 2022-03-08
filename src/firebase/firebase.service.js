"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FirebaseService = void 0;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var firebase = require("firebase-admin");
var FirebaseService = /** @class */ (function () {
    /**
     * @ignore
     */
    function FirebaseService(configService) {
        var _this = this;
        this.configService = configService;
        this.getAuth = function () {
            return _this.firebaseApp.auth();
        };
        this.db = function (collection) {
            return _this.firestore().collection(collection);
        };
        this.firestore = function () {
            return _this.firebaseApp.firestore();
        };
        this.getRestaurantDataApi = function (restaurantId) {
            return new tastiest_utils_1.RestaurantDataApi(firebase, restaurantId);
        };
        this.getUserDataApi = function (userId) {
            return new tastiest_utils_1.UserDataApi(firebase, userId);
        };
        this.firebaseApp = firebase.initializeApp({
            credential: firebase.credential.cert({
                projectId: configService.get('FIREBASE_PROJECT_ID'),
                clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
                privateKey: configService
                    .get('FIREBASE_PRIVATE_KEY')
                    .replace(/\\n/g, '\n')
            }),
            databaseURL: configService.get('FIREBASE_DATABASE_URL')
        });
    }
    FirebaseService = __decorate([
        (0, common_1.Injectable)()
    ], FirebaseService);
    return FirebaseService;
}());
exports.FirebaseService = FirebaseService;
