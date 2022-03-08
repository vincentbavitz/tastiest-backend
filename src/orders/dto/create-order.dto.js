"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var class_validator_1 = require("class-validator");
var CreateOrderDto = /** @class */ (function () {
    function CreateOrderDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)()
    ], CreateOrderDto.prototype, "productId");
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.IsPositive)()
    ], CreateOrderDto.prototype, "heads");
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.IsPositive)()
    ], CreateOrderDto.prototype, "bookedForTimestamp");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateOrderDto.prototype, "promoCode");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], CreateOrderDto.prototype, "userAgent");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsBoolean)()
    ], CreateOrderDto.prototype, "isTest");
    return CreateOrderDto;
}());
exports["default"] = CreateOrderDto;
