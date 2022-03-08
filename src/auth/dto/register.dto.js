"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var class_validator_1 = require("class-validator");
var RegisterDto = /** @class */ (function () {
    function RegisterDto() {
    }
    __decorate([
        (0, class_validator_1.IsEmail)()
    ], RegisterDto.prototype, "email");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MinLength)(6),
        (0, class_validator_1.MaxLength)(32)
    ], RegisterDto.prototype, "password");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MinLength)(2),
        (0, class_validator_1.MaxLength)(32)
    ], RegisterDto.prototype, "firstName");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], RegisterDto.prototype, "userAgent");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], RegisterDto.prototype, "anonymousId");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsBoolean)()
    ], RegisterDto.prototype, "isTestAccount");
    return RegisterDto;
}());
exports["default"] = RegisterDto;
