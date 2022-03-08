"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var class_validator_1 = require("class-validator");
/** We get userID from the request's JWT token */
var FollowRestaurantDto = /** @class */ (function () {
    function FollowRestaurantDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)()
    ], FollowRestaurantDto.prototype, "restaurantId");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsBoolean)()
    ], FollowRestaurantDto.prototype, "notifyNewMenu");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsBoolean)()
    ], FollowRestaurantDto.prototype, "notifyGeneralInfo");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsBoolean)()
    ], FollowRestaurantDto.prototype, "notifyLastMinuteTables");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsBoolean)()
    ], FollowRestaurantDto.prototype, "notifyLimitedTimeDishes");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsBoolean)()
    ], FollowRestaurantDto.prototype, "notifySpecialExperiences");
    return FollowRestaurantDto;
}());
exports["default"] = FollowRestaurantDto;
