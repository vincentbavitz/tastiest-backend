"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var class_validator_1 = require("class-validator");
var UpdateUserTicketDto = /** @class */ (function () {
    function UpdateUserTicketDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserTicketDto.prototype, "token");
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsString)()
    ], UpdateUserTicketDto.prototype, "ticketId");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsBoolean)()
    ], UpdateUserTicketDto.prototype, "resolved");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsIn)(['critical', 'high', 'normal', 'low'])
    ], UpdateUserTicketDto.prototype, "priority");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsIn)(['GENERAL', 'ORDER', 'OTHER', 'BUG', 'FEATURE_REQUEST'])
    ], UpdateUserTicketDto.prototype, "type");
    return UpdateUserTicketDto;
}());
exports["default"] = UpdateUserTicketDto;
