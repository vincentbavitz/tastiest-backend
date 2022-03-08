"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmailScheduleDto = void 0;
var class_validator_1 = require("class-validator");
var EmailScheduleDto = /** @class */ (function () {
    function EmailScheduleDto() {
    }
    __decorate([
        (0, class_validator_1.IsEmail)({}, { each: true })
    ], EmailScheduleDto.prototype, "recipients");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)()
    ], EmailScheduleDto.prototype, "subject");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)()
    ], EmailScheduleDto.prototype, "content");
    __decorate([
        (0, class_validator_1.IsDateString)()
    ], EmailScheduleDto.prototype, "date");
    return EmailScheduleDto;
}());
exports.EmailScheduleDto = EmailScheduleDto;
exports["default"] = EmailScheduleDto;
