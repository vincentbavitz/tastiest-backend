"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var class_validator_1 = require("class-validator");
var SetAccountRoleDto = /** @class */ (function () {
    function SetAccountRoleDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MinLength)(1),
        (0, class_validator_1.IsNotEmpty)()
    ], SetAccountRoleDto.prototype, "uid");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsIn)(Object.values(tastiest_utils_1.UserRole)),
        (0, class_validator_1.IsOptional)()
    ], SetAccountRoleDto.prototype, "role");
    return SetAccountRoleDto;
}());
exports["default"] = SetAccountRoleDto;
