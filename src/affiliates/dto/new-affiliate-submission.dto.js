"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var class_validator_1 = require("class-validator");
var NewAffiliateSubmissionDto = /** @class */ (function () {
    function NewAffiliateSubmissionDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsIn)(['instagram', 'tiktok', 'facebook', 'youtube', 'website'])
    ], NewAffiliateSubmissionDto.prototype, "platform");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.MinLength)(2),
        (0, class_validator_1.MaxLength)(64)
    ], NewAffiliateSubmissionDto.prototype, "reference");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsIn)(['general', 'influencer'])
    ], NewAffiliateSubmissionDto.prototype, "affiliateType");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], NewAffiliateSubmissionDto.prototype, "userId");
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], NewAffiliateSubmissionDto.prototype, "anonymousId");
    return NewAffiliateSubmissionDto;
}());
exports["default"] = NewAffiliateSubmissionDto;
