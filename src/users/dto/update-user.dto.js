"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var user_financial_dto_1 = require("./user-financial.dto");
var user_location_dto_1 = require("./user-location.dto");
var UpdateUserDto = /** @class */ (function () {
    function UpdateUserDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)()
    ], UpdateUserDto.prototype, "uid");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserDto.prototype, "firstName");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserDto.prototype, "lastName");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserDto.prototype, "mobile");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsDateString)()
    ], UpdateUserDto.prototype, "birthday");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return user_location_dto_1.UserLocationDto; })
    ], UpdateUserDto.prototype, "location");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return user_financial_dto_1.UserFinancialDto; })
    ], UpdateUserDto.prototype, "financial");
    return UpdateUserDto;
}());
exports["default"] = UpdateUserDto;
